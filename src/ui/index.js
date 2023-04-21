const socket = io();

const toggleBtn = document.getElementById('toggleBtn');

let load1 = false;

toggleBtn.addEventListener('click', () => {
    load1 = !load1;
    updateUI();
    socket.emit('load1', load1);
});

const updateUI = () => {
    load1
        ? toggleBtn.classList.add('on')
        : toggleBtn.classList.remove('on');
    toggleBtn.innerText = load1 ? 'Turn off' : 'Turn on';
};

socket.on('load1', state => {
    console.log('updated state', state);
    load1 = state;
    updateUI();
});
