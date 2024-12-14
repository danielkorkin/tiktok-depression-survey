import crypto from "crypto";

export function encryptWithPublicKey(data: any): string {
	try {
		// Get public key from environment variable
		const publicKey = process.env.PUBLIC_KEY?.replace(/\\n/g, "\n") || "";

		// Convert data to string if it's an object
		const stringData =
			typeof data === "string" ? data : JSON.stringify(data);

		// Encrypt using RSA-OAEP with SHA-256
		const encrypted = crypto.publicEncrypt(
			{
				key: publicKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
			},
			Buffer.from(stringData)
		);

		// Return base64 encoded string
		return encrypted.toString("base64");
	} catch (error) {
		console.error("Encryption error:", error);
		throw new Error("Failed to encrypt data");
	}
}
