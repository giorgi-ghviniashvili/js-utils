export const findTimeDifference = (startDate: Date, endDate: Date) => {
	const difference = endDate.getTime() - startDate.getTime();

	const minutes = Math.floor(difference / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (hours < 1) {
		return `${minutes} min`;
	} else if (hours < 24) {
		const remainingMinutes = minutes % 60;

		if (remainingMinutes) {
			return `${hours} hr, ${remainingMinutes} min`;
		}

		return `${hours} hr`
	} else {
		const remainingHours = hours % 24

		if (remainingHours) {
			return `${days} day, ${remainingHours} hr`
		}

		return `${days} day`
	}
}
