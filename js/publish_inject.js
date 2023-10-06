const publishBtn = document.querySelector('.add-list-publish:not([disabled])');

console.log('starting publish');
window.confirm = function(){
    return true;
}
publishBtn.click();
console.log('published link')