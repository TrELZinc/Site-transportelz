#!/usr/bin/env python3
import http.server
import ssl
import socketserver
import os

# Créer un certificat auto-signé temporaire
def create_self_signed_cert():
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        import datetime
        
        # Générer une clé privée
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # Créer le certificat
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "CA"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "QC"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "Montreal"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Transport ELZ"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress("127.0.0.1"),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # Sauvegarder les fichiers
        with open("server.key", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        with open("server.crt", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
            
        return True
    except ImportError:
        print("Cryptography non disponible, utilisation d'un certificat simple...")
        return False

# Créer un certificat simple avec OpenSSL
def create_simple_cert():
    try:
        import subprocess
        # Créer un certificat auto-signé simple
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:4096", 
            "-keyout", "server.key", "-out", "server.crt", 
            "-days", "365", "-nodes", "-subj", 
            "/C=CA/ST=QC/L=Montreal/O=Transport ELZ/CN=localhost"
        ], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

# Essayer de créer un certificat
if not create_self_signed_cert() and not create_simple_cert():
    print("Impossible de créer un certificat SSL. Utilisation d'un certificat factice...")
    # Créer des fichiers factices
    with open("server.key", "w") as f:
        f.write("-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----")
    with open("server.crt", "w") as f:
        f.write("-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKoK/Ovj8uU3MA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV...\n-----END CERTIFICATE-----")

# Configuration du serveur
PORT = 8443
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    # Configuration SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain("server.crt", "server.key")
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"Serveur HTTPS démarré sur https://localhost:{PORT}")
    print(f"Accédez à: https://localhost:{PORT}/pdf.html")
    print("Appuyez sur Ctrl+C pour arrêter")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServeur arrêté")
        # Nettoyer les fichiers temporaires
        try:
            os.remove("server.key")
            os.remove("server.crt")
        except:
            pass
