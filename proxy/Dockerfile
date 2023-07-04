ARG TARGET=aarch64-unknown-linux-musl

FROM messense/rust-musl-cross:aarch64-musl AS builder
ARG TARGET
WORKDIR /usr/src
RUN rustup target add $TARGET

RUN USER=root cargo new helium-proxy
WORKDIR /usr/src/helium-proxy
COPY Cargo.toml Cargo.lock ./
RUN cargo build --target $TARGET --release
RUN sleep 1s

COPY src ./src
RUN echo " " >> ./src/main.rs
RUN cargo build --target $TARGET --release
# RUN cargo install --target $TARGET --root ./install --path .

FROM alpine:3.15.1
ARG TARGET
COPY --from=builder /usr/src/helium-proxy/target/$TARGET/release/proxy ./
# COPY --from=builder /usr/src/vult-server/install/vult-server ./
USER 1000

EXPOSE 3000
ENTRYPOINT [ "./proxy" ]
CMD [ "run" ]