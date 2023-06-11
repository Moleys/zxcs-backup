// syelom 2023-05-24
let resFiles = "";
const storageKey = "store_zxcs";
var selectGateway = $("#gateway");
var savedGateway = localStorage.getItem('ipfs_gateway');
if (savedGateway) {
	selectGateway.val(savedGateway);
}
function setGateway() {
	var selectedGateway = selectGateway.val();
	localStorage.setItem('ipfs_gateway', selectedGateway);
}
async function fetchFiles() {
	let storedData = localStorage.getItem(storageKey);
	if (storedData) {
		resFiles = JSON.parse(storedData);
	} else {
		const response = await fetch('/list-zxcs.csv');
		const csvData = await response.text();
		resFiles = $.csv.toObjects(csvData);
		localStorage.setItem(storageKey, JSON.stringify(resFiles));
	}
}
function searchNovels() {
	$("#list_search").empty();
	const searchValue = $('#txt_search').val();
	if (!searchValue) {
		alert("请输入搜索内容");
		return;
	}
	const matchingFiles = resFiles.filter(file => file.name.includes(searchValue));
	if (!matchingFiles.length) {
		alert("未找到结果");
		return;
	}
	matchingFiles.forEach(file => {
		const selectedGateway = selectGateway.val();
		const fileLink = `${selectedGateway}${file.cid}?filename=${file.name}`;
		$("#list_search").append(`<li><a target="_blank" rel="noopener noreferrer" href="${fileLink}">${file.name}</a></li>`);
	});
}
function showRandomNovels() {
	$("#list_search").empty();
	const shuffled = resFiles.sort(() => Math.random() - 0.5);
	const selected = shuffled.slice(0, 10);
	selected.forEach(file => {
		const selectedGateway = selectGateway.val();
		const fileLink = `${selectedGateway}${file.cid}?filename=${file.name}`;
		$("#list_search").append(`<li><a target="_blank" rel="noopener noreferrer" href="${fileLink}">${file.name}</a></li>`);
	});
}
function showAllNovels() {
	$("#list_search").empty();
	const sortedFiles = resFiles.sort((a, b) => a.name.localeCompare(b.name));
	sortedFiles.forEach(file => {
		const selectedGateway = selectGateway.val();
		const fileLink = `${selectedGateway}${file.cid}?filename=${file.name}`;
		$("#list_search").append(`<li><a target="_blank" rel="noopener noreferrer" href="${fileLink}">${file.name}</a></li>`);
	});
}
async function initialize() {
	await fetchFiles();
}
initialize();