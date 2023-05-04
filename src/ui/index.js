const socket = io();

const toggleBtns = document.querySelectorAll('.toggleBtn');
const sensors = document.querySelector('.devices');
const disco = document.querySelector('#disco');
let data = {
    "BUILTIN": false,
    "LED": false,
    "LED1": false,
    "LED2": false,
    "SENSOR": 25
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

disco.addEventListener('click', (e) => {
    toggleBtns.forEach(btn => {
        const id = (btn.getAttribute("data-id"));
        setInterval(() => {
            data[id] = !data[id];
            updateUI(btn, id)
            socket.emit(id, data[id]);
        }, 800);
    })
})
socket.on("SENSOR", (data) => {
    console.log(data);
    sensors.innerHTML = `Sensor ${data}`;
})
const updateUI = (btn, id) => {
    data[id]
        ? btn.classList.add('on')
        : btn.classList.remove('on');
    btn.innerHTML = data[id] ? `${id} <br> Turn off` : `${id} <br> Turn on`;
};

socket.on('initial', state => {
    console.log('updated state', state);
    data = state;
    toggleBtns.forEach(btn => {
        updateUI(btn, btn.getAttribute("data-id"));
    })
});
