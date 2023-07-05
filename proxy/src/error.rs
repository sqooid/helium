use std::{error::Error, fmt::Display};

#[derive(Debug)]
pub enum ServerError {
    BadPath(String),
    ContentSize,
    RequestError(hyper::Error),
}

impl Display for ServerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            ServerError::BadPath(s) => format!("Error: BadPath {}", s),
            ServerError::ContentSize => {
                "Request body is too large or not able to be determined".to_string()
            }
            ServerError::RequestError(e) => e.to_string(),
        };
        write!(f, "{}", s)
    }
}

impl Error for ServerError {}
