import argparse
from http.server import SimpleHTTPRequestHandler, socketserver


def run(port=8009):
    PORT = port

    Handler = SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
    })

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serving at port {}, ctrl+c to stop".format(PORT))
        httpd.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("port_number", help="The port number to use")
    args = parser.parse_args()

    PORT = int(args.port_number)

    try:
        run(PORT)
    except KeyboardInterrupt:
        print("server interupted by user")
    except OSError as err:
        if "WinError 10048" in str(err):
            print(str(err))
            input("Press ENTER to continu...")
