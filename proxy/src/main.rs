use hyper::body::{to_bytes, HttpBody};
use hyper::http::{response, HeaderValue};
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Client, HeaderMap, Request, Response, Server, StatusCode, Uri};
use hyper_tls::HttpsConnector;
use std::convert::Infallible;
use std::net::SocketAddr;
use std::{env, time};

const MAX_ALLOWED_BODY_SIZE: u64 = 1024 * 1024 * 256;

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

async fn hello_world(mut req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let method = req.method().clone();
    let path = req
        .uri()
        .path_and_query()
        .map(|x| x.as_str())
        .unwrap_or("/");
    let mut path_iter = path.chars();
    path_iter.next();
    let path_clean = path_iter.as_str().to_owned();

    // Remove origin for CORS
    let headers = req.headers_mut();
    headers.remove("Origin");

    //  Set cookie for image uploads
    let cookie = headers.get("X-Token").cloned();

    let mut response_headers = HeaderMap::new();
    response_headers.insert("Access-Control-Allow-Origin", HeaderValue::from_static("*"));

    // Guaranteed bad url
    let parts = match path_clean.split_once('/') {
        Some(x) => x,
        None => {
            return Ok(default_response_builder(StatusCode::BAD_REQUEST)
                .body(Body::empty())
                .unwrap());
        }
    };

    let _destination_url = Uri::builder()
        .scheme("https")
        .authority(parts.0)
        .path_and_query(parts.1)
        .build()
        .unwrap();

    let https = HttpsConnector::new();
    let client = Client::builder().build(https);

    let request_content_length = match req.body().size_hint().upper() {
        Some(v) => v,
        None => MAX_ALLOWED_BODY_SIZE + 1,
    };
    let body_bytes;
    if request_content_length < MAX_ALLOWED_BODY_SIZE {
        body_bytes = match to_bytes(req.into_body()).await {
            Ok(b) => b,
            Err(_e) => {
                println!("Failed to read body");
                return Ok(default_response_builder(StatusCode::BAD_REQUEST)
                    .body(Body::empty())
                    .unwrap());
            }
        };
    } else {
        return Ok(default_response_builder(StatusCode::BAD_REQUEST)
            .body(Body::empty())
            .unwrap());
    }

    let mut builder = Request::builder()
        .method(method)
        .uri(format!("https://{}", &path_clean));
    builder.headers_mut().and_then(|x| {
        if let Some(jwt) = cookie {
            x.append("Cookie", jwt);
        }
        x.remove("Origin")
    });
    let proxy_request = builder.body(Body::from(body_bytes)).unwrap();
    let start_time = time::Instant::now();
    log(&format!(
        "{} request to {}",
        proxy_request.method(),
        proxy_request.uri()
    ));

    let proxy_response = client.request(proxy_request).await;
    log(&format!("took {}ms", start_time.elapsed().as_millis(),));

    match proxy_response {
        Ok(mut r) => {
            let _headers = r.headers_mut();
            Ok(r)
        }
        Err(_) => Ok(default_response_builder(StatusCode::INTERNAL_SERVER_ERROR)
            .body(Body::empty())
            .unwrap()),
    }
}

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from((
        [0, 0, 0, 0],
        match env::var("PORT") {
            Ok(port) => port.parse().expect("Invalid port"),
            Err(_) => 3000,
        },
    ));

    // A `Service` is needed for every connection, so this
    // creates one from our `hello_world` function.
    let make_svc = make_service_fn(|_conn| async {
        // service_fn converts our function into a `Service`
        Ok::<_, Infallible>(service_fn(hello_world))
    });

    let server = Server::bind(&addr).serve(make_svc);

    // Run this server for... forever!
    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}
