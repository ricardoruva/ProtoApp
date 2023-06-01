export const bytesToMBorGB = ({ bytes }: { bytes: number }) => {
	const megabytes = bytes / (1024 * 1024);
	if (megabytes < 1024) {
		return `${megabytes.toFixed(0)}MB`;
	} else {
		const gigabytes = megabytes / 1024;
		return `${gigabytes.toFixed(0)}GB`;
	}
};

export const bytesToMB = ({ bytes }: { bytes: number }) => {
	return bytes / (1024 * 1024);
};

export const bytesToGB = ({ bytes }: { bytes: number }) => {
	return bytes / (1024 * 1024 * 1024);
};
