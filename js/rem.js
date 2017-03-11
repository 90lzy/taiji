/*实时改变html的fontSize值*/
function remReSize() {
	var deviceWidth = document.documentElement.clientWidth;
	if(deviceWidth > 640) deviceWidth = 640;
	document.documentElement.style.fontSize = deviceWidth / 6.4 + 'px';
}
remReSize();
window.onload = function() {
	window.onresize = function() {
		remReSize();
	}
};