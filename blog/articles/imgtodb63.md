const fileToBase64 = (file, callback) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = function (evt) {
if (typeof callback === "function") {
callback(evt.target?.result);
} else {
console.log("我是 base64:", evt.target?.result);
}
};
/_ readAsDataURL 方法会读取指定的 Blob 或 File 对象
\*\* 读取操作完成的时候，会触发 onload 事件
_ result 属性将包含一个 data:URL 格式的字符串（base64 编码）以表示所读取文件的内容。
\*/
};

function handleDrop(
event: React.DragEvent<HTMLDivElement> & { target: { innerHTML: string } }
) {
event.preventDefault();
console.log(event, "event");
const files = event.dataTransfer.files;
console.log("files", files);
const html = "";
for (const f of files) {
fileToBase64(f, (base64) => {
event.target.innerHTML += `<img src="${base64}" alt="${f.name}"/>`;
});
}
}
