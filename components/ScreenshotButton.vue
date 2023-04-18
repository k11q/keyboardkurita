<template>
	<button class="rounded-md h-16 w-16" @click="takeScreenshot">
		<Icon name="lucide:camera" size="1.25rem" />
	</button>
</template>

<script setup>
import html2canvas from "html2canvas";
const props = defineProps({
	targetElementId: String,
	username: {
		type: String,
		default: "username",
	},
	date: String,
});

async function takeScreenshot() {
	const targetElement = document.getElementById(props.targetElementId);
	if (!targetElement) return;

	const padding = 40; // Custom padding value (in pixels)
	const paddingY = 20;
	const aspectRatio = 2; // Custom aspect ratio (e.g., 16:9)

	const originalWidth = targetElement.clientWidth;
	const originalHeight = targetElement.clientHeight;
	const newWidth = originalWidth + 2 * padding;
	const newHeight = originalHeight + 5 * paddingY;

	const watermarkText = `${props.username} | ${props.date} | keyboardkurita.com`;
	const watermarkFontSize = 20; // Font size for the watermark text (in pixels)

	try {
		const canvas = await html2canvas(targetElement, {
			width: newWidth,
			height: newHeight,
			x: -padding,
			y: -paddingY,
			backgroundColor: "#171717",
		});

		const ctx = canvas.getContext("2d");
		ctx.font = `${watermarkFontSize}px ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace`;
		ctx.fillStyle = "#737373";

		// Calculate the x and y positions for the watermark text in the bottom right corner
		const textWidth = ctx.measureText(watermarkText).width;
		const textX = newWidth - textWidth - padding;
		const textHeight = watermarkFontSize;
		const textY = newHeight + paddingY * 8;

		ctx.fillText(watermarkText, textX, textY);

		const imageDataURL = canvas.toDataURL("image/png");
		copyToClipboard(imageDataURL);
	} catch (err) {
		console.error("Failed to take screenshot:", err);
	}
}
async function copyToClipboard(imageDataURL) {
	try {
		const dataBlob = await (await fetch(imageDataURL)).blob();
		const clipboardItem = new ClipboardItem({
			"image/png": dataBlob,
		});
		await navigator.clipboard.write([clipboardItem]);
		console.log("Image copied to clipboard");
	} catch (err) {
		console.error("Failed to copy image to clipboard:", err);
	}
}
</script>
