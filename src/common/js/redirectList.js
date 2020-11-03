export const redirectList = [
	'/billList.html'
];

export function findRedirect() {
	let find = '/home';
	redirectList.forEach((item) => {
		if(window.location.href.indexOf(item) > -1) {
			find = item;
			return;
		}
	});
	return find;
}