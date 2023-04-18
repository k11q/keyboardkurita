<template>
	<button class="rounded-md h-16 w-16" @click="handleScreenshot">
		<Icon name="lucide:camera" size="1.25rem" />
	</button>
	<Toaster
		:toastOptions="{
			style: { background: '#202020', border: '1px solid #2C2C2C' , borderRadius: '8px', color: '#6BD968'},
			className: 'custom-toaster',
			descriptionClassName: 'my-toast-description',
		}"
	/>
</template>

<script setup>
import { Toaster, toast } from "vue-sonner";
import html2canvas from "html2canvas";
const props = defineProps({
	targetElementId: String,
	username: {
		type: String,
		default: "username",
	},
	date: String,
});

async function handleScreenshot() {
	toast.promise(
		takeScreenshot(),
		{
			loading: "Saving screenshot...",
			success: (data) => `Screenshot saved to clipboard`,
			error: (data) => "Error",
		},
		{
			style: {
				background: "red",
			},
			className: "my-toast",
			descriptionClassName: "my-toast-description",
		}
	);
}

function takeScreenshot() {
	return new Promise(async (resolve, reject) => {
		const targetElement = document.getElementById(
			props.targetElementId
		);
		if (!targetElement) return;

		const padding = 40; // Custom padding value (in pixels)
		const paddingY = 20;
		const aspectRatio = 2; // Custom aspect ratio (e.g., 16:9)

		const originalWidth = targetElement.clientWidth;
		const originalHeight = targetElement.clientHeight;
		const newWidth = originalWidth + 2 * padding;
		const newHeight = originalHeight + 5 * paddingY;

		const watermark = document.createElement("div");
		watermark.classList.add(
			"watermark",
			"absolute",
			"right-0",
			"translate-x-2",
			"bottom-0",
			"translate-y-14",
			"text-xl",
			"text-neutral-500"
		);
		watermark.innerText = `${props.username} | ${props.date} | keyboardkurita.com`;
		targetElement.appendChild(watermark);

		try {
			const canvas = await html2canvas(targetElement, {
				width: newWidth,
				height: newHeight,
				x: -padding,
				y: -paddingY,
				backgroundColor: "#171717",
			});

			const imageDataURL = canvas.toDataURL("image/png");
			await copyToClipboard(imageDataURL);

			// Resolve the promise with the name of the screenshot
			resolve({ name: `${props.username}'s screenshot` });
		} catch (err) {
			console.error("Failed to take screenshot:", err);
			reject(err);
		} finally {
			targetElement.removeChild(watermark);
		}
	});
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

<style scoped>
.custom-toaster {
	@apply bg-red-500
}
</style>
