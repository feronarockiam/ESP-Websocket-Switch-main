const socket = io();

const toggleBtns = document.querySelectorAll('.toggleBtn');
let data = {
    "BUILTIN": false,
    "LED": false,
}
toggleBtns.forEach(btn => {
    const id = (btn.getAttribute("data-id"));
    socket.on(id, value => {
        data[id] = value;
        updateUI(btn, id);
    });

    btn.addEventListener('click', (e) => {
        data[id] = !data[id];
        updateUI(btn, id)
        socket.emit(id, data[id]);
    })
})


const updateUI = (btn, id) => {
    data[id]
        ? btn.classList.add('on')
        : btn.classList.remove('on');
    btn.innerText = data[id] ? 'Turn off' : 'Turn on';
};

socket.on('initial', state => {
    console.log('updated state', state);
    data = state;
    toggleBtns.forEach(btn => {
        updateUI(btn, btn.getAttribute("data-id"));
    })
});
