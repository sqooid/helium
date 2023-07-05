mod error;
use error::ServerError;
use hyper::body::HttpBody;
use hyper::http::response;
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Client, Request, Response, Server, StatusCode, Uri};
use hyper_tls::HttpsConnector;
use std::convert::Infallible;
use std::net::SocketAddr;
use std::str::FromStr;
use std::{env, time};

fn log(content: &str) {
    let timestamp = chrono::offset::Local::now();
    println!(
        "[{}] {}",
        timestamp.format("%Y-%m-%d %H:%M:%S.%.3f"),
        content
    );
}

fn default_response_builder(status: StatusCode) -> response::Builder {
    Response::builder()
        .status(status)
        .header("Access-Control-Allow-Origin", "*")
}

async fn handler_wrapper(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    match proxy_handler(req).await {
        Ok(r) => Ok(r),
        Err(e) => Ok(match e {
            ServerError::BadPath(s) => default_response_builder(StatusCode::BAD_REQUEST)
                .body(Body::from(s))
                .unwrap(),
            ServerError::ContentSize => default_response_builder(StatusCode::BAD_REQUEST)
                .body(Body::from(e.to_string()))
                .unwrap(),
            ServerError::RequestError(e) => {
                default_response_builder(StatusCode::INTERNAL_SERVER_ERROR)
                    .body(Body::from(e.message().to_string()))
                    .unwrap()
            }
        }),
    }
}

async fn proxy_handler(req: Request<Body>) -> Result<Response<Body>, ServerError> {
    let path = req
        .uri()
        .path_and_query()
        .map(|x| x.as_str())
        .ok_or_else(|| ServerError::BadPath("path could not be parsed".to_string()))?;
    let mut path_iter = path.chars();
    path_iter.next();
    let path_clean = path_iter.as_str().to_owned();

    let (mut parts, body) = req.into_parts();

    // Remove origin for CORS
    let mut headers = parts.headers;
    headers.remove("Origin");
    if let Some(jwt_cookie) = headers.get("X-Token") {
        //  Set cookie for image uploads
        headers.append("Cookie", jwt_cookie.clone());
    };
    parts.headers = headers;

    // Can perform own path checks
    // let (domain, path) = path_clean
    //     .split_once('/')
    //     .ok_or_else(|| ServerError::BadPath("Path is invalid".to_string()))?;

    let https = HttpsConnector::new();
    let client = Client::builder().build(https);

    // Can impose maximum body limit
    let max_body_size = env::var("MAX_BODY_SIZE")
        .map(|v| v.parse().expect("invalid MAX_BODY_SIZE provided"))
        .unwrap_or(0);
    if max_body_size > 0 {
        body.size_hint()
            .upper()
            .filter(|s| s <= &max_body_size)
            .ok_or_else(|| ServerError::ContentSize)?;
    }

    parts.uri = Uri::from_str(&format!("https://{}", &path_clean))
        .map_err(|_| ServerError::BadPath("destination URI is invalid".to_string()))?;

    let proxy_request = Request::from_parts(parts, body);

    let start_time = time::Instant::now();
    log(&format!(
        "{} request to {}",
        proxy_request.method(),
        proxy_request.uri()
    ));

    let proxy_response = client.request(proxy_request).await;
    log(&format!("took {}ms", start_time.elapsed().as_millis(),));

    proxy_response.map_err(ServerError::RequestError)
}

#[tokio::main]
async fn main() {
    let port = match env::var("PORT") {
        Ok(port) => port.parse().expect("Invalid port"),
        Err(_) => 3000,
    };
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let make_svc =
        make_service_fn(|_conn| async { Ok::<_, Infallible>(service_fn(handler_wrapper)) });

    let server = Server::bind(&addr).serve(make_svc);
    log(&format!("Listening on port {}", port));

    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}
