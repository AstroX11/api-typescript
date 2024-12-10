import { Sticker, StickerTypes } from 'wa-sticker-formatter';

class StickerGenerator {
	/**
	 * Neon Glowing Text Sticker
	 * @param {string} text - Text to create sticker from
	 * @returns {Promise<Sticker>} Generated sticker
	 */
	static async neonGlowSticker(text) {
		// Create a canvas with neon effect
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set canvas size
		canvas.width = 512;
		canvas.height = 512;

		// Background gradient
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop(0, '#FF00FF');
		gradient.addColorStop(0.5, '#00FFFF');
		gradient.addColorStop(1, '#FF00FF');

		// Clear and set background
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Text styling
		ctx.font = 'bold 80px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Neon text effect
		ctx.fillStyle = gradient;
		ctx.shadowColor = 'cyan';
		ctx.shadowBlur = 20;
		ctx.fillText(text, canvas.width / 2, canvas.height / 2);

		// Create sticker from canvas
		return new Sticker(canvas.toDataURL(), {
			pack: 'Neon Glow',
			author: 'Sticker Bot',
			type: StickerTypes.FULL,
		});
	}

	/**
	 * Animated Gradient Text Sticker
	 * @param {string} text - Text to create sticker from
	 * @returns {Promise<Sticker>} Generated sticker
	 */
	static async animatedGradientSticker(text) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = 512;
		canvas.height = 512;

		// Animation frames
		const frames = 30;
		const animatedFrames = [];

		for (let i = 0; i < frames; i++) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Rotating gradient effect
			const gradient = ctx.createLinearGradient(0, 0, canvas.width * Math.sin(i * 0.1), canvas.height * Math.cos(i * 0.1));
			gradient.addColorStop(0, `hsl(${(i * 12) % 360}, 100%, 50%)`);
			gradient.addColorStop(1, `hsl(${(i * 12 + 180) % 360}, 100%, 50%)`);

			ctx.fillStyle = gradient;
			ctx.font = 'bold 70px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, canvas.width / 2, canvas.height / 2);

			animatedFrames.push(canvas.toDataURL());
		}

		return new Sticker(animatedFrames, {
			pack: 'Gradient Waves',
			author: 'Sticker Bot',
			type: StickerTypes.CROP,
		});
	}

	/**
	 * 3D Embossed Text Sticker
	 * @param {string} text - Text to create sticker from
	 * @returns {Promise<Sticker>} Generated sticker
	 */
	static async embossedTextSticker(text) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = 512;
		canvas.height = 512;

		// Background
		ctx.fillStyle = '#F0F0F0';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 3D Text Effect
		ctx.font = 'bold 80px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Shadow effect for 3D look
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fillText(text, canvas.width / 2 + 3, canvas.height / 2 + 3);

		ctx.fillStyle = '#333';
		ctx.fillText(text, canvas.width / 2, canvas.height / 2);

		return new Sticker(canvas.toDataURL(), {
			pack: '3D Emboss',
			author: 'Sticker Bot',
			type: StickerTypes.FULL,
		});
	}

	/**
	 * Particle Text Animation Sticker
	 * @param {string} text - Text to create sticker from
	 * @returns {Promise<Sticker>} Generated sticker
	 */
	static async particleTextSticker(text) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = 512;
		canvas.height = 512;

		const frames = 40;
		const particles = [];

		// Initialize particles
		for (let i = 0; i < text.length * 10; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 5,
				color: `hsl(${Math.random() * 360}, 100%, 50%)`,
				speed: Math.random() * 2,
			});
		}

		const animatedFrames = [];

		for (let frame = 0; frame < frames; frame++) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgba(0,0,0,0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Animate particles
			particles.forEach(p => {
				p.x += Math.sin(frame * 0.1) * p.speed;
				p.y += Math.cos(frame * 0.1) * p.speed;

				ctx.beginPath();
				ctx.fillStyle = p.color;
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fill();
			});

			// Draw text
			ctx.font = 'bold 50px Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, canvas.width / 2, canvas.height / 2);

			animatedFrames.push(canvas.toDataURL());
		}

		return new Sticker(animatedFrames, {
			pack: 'Particle Magic',
			author: 'Sticker Bot',
			type: StickerTypes.CROP,
		});
	}

	/**
	 * Holographic Shimmering Sticker
	 * @param {string} text - Text to create sticker from
	 * @returns {Promise<Sticker>} Generated sticker
	 */
	static async holographicSticker(text) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = 512;
		canvas.height = 512;

		const frames = 25;
		const animatedFrames = [];

		for (let i = 0; i < frames; i++) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Holographic background
			const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			gradient.addColorStop(0, `hsla(${(i * 15) % 360}, 100%, 50%, 0.7)`);
			gradient.addColorStop(1, `hsla(${(i * 15 + 180) % 360}, 100%, 50%, 0.7)`);

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Shimmering text effect
			ctx.font = 'bold 70px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			// Multiple text layers for holographic effect
			ctx.fillStyle = `hsla(0, 0%, 100%, ${0.5 + Math.sin(i * 0.3) * 0.5})`;
			ctx.fillText(text, canvas.width / 2 + Math.sin(i * 0.2) * 10, canvas.height / 2 + Math.cos(i * 0.2) * 10);

			ctx.fillStyle = `hsla(${(i * 20) % 360}, 100%, 50%, 0.8)`;
			ctx.fillText(text, canvas.width / 2, canvas.height / 2);

			animatedFrames.push(canvas.toDataURL());
		}

		return new Sticker(animatedFrames, {
			pack: 'Holographic',
			author: 'Sticker Bot',
			type: StickerTypes.CROP,
		});
	}
}

// Export the sticker generator methods
export default StickerGenerator;

// Usage example:
// const neonSticker = await StickerGenerator.neonGlowSticker('Hello');
// await neonSticker.sendSticker(chat);
