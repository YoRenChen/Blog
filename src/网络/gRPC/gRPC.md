# gRPC

由 Google 主要面向移动应用开发。

- gRPC 是一个高性能、通用的开源 RPC 框架
- 基于 HTTP/2 协议标准
- 基于 ProtoBuf(Protocol Buffers) 序列化协议

#### gRPC 通常有四种模式

- unary：一元请求，一请求一返回

- client streaming：客户端通过流向服务端发送一系列消息，然后等待服务端读取完数据并返回处理结果

- server streaming：客户端发送一个请求，服务端返回一个流给客户端，客户从流中读取一系列消息，直到读取完成

- bidirectional streaming：客户端和服务端都可以独立向对方发送或接受一系列的消息。客户端和服务端读写的顺序是任意。

### Grpc In Browser

https://grpc.io/blog/state-of-grpc-web/
js 不能强制使用 http2，也无法进行细粒度的控制
浏览器支持 http2 更多的是在底层，比如资源加载的时候

###

后端 grpc 对 h5 是转 restful 提供接口（一个 go 的 grpc-gateway）
