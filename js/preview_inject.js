const previewBtn = document.querySelector('.add-list-preview');

console.log('starting preview');
window.confirm = function(){
    return true;
}
previewBtn.click();
console.log('previewed link')

