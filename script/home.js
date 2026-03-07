const allBtn = document.getElementById('allBtn');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const cardContainer = document.getElementById('cardContainer');
const spinner = document.getElementById('spinner');
const modalTittle = document.getElementById('modalTittle');
const modalStatus = document.getElementById('modalStatus');
const modalName = document.getElementById('modalName');
const modalNameB = document.getElementById('modalNameB');
const modalDate = document.getElementById('modalDate');
const modalDes = document.getElementById('modalDes');
const modalPriority = document.getElementById('modalPriority');
let open = [];
let close = [];
function loadingSpinner(status) {
    if (status === true) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}
function toggle(id) {
    const selected = document.getElementById(id);
    allBtn.classList.remove('btn-primary');
    openBtn.classList.remove('btn-primary');
    closeBtn.classList.remove('btn-primary');

    allBtn.classList.add('bg-base-100');
    openBtn.classList.add('bg-base-100');
    closeBtn.classList.add('bg-base-100');

    selected.classList.remove('bg-base-100');
    selected.classList.add('btn-primary');
    if (id === 'openBtn') {
        loadingSpinner(true);
        displayData(open);
    } else if (id === 'closeBtn') {
        loadingSpinner(true)
        displayData(close);
    } else if (id === 'allBtn') {
        loadingSpinner(true);
        loadData();
    }
}

async function loadData() {
    loadingSpinner(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();

    data.data.forEach(element => {
        if (element.status === 'open') {
            open.push(element);
        } else {
            close.push(element);
        }
    });
    displayData(data.data);

}

function displayData(data) {
    cardContainer.innerHTML = '';
    data.forEach(element => {

        const newCard = document.createElement('div');
        if (element.status === 'open') {
            newCard.className = ('border-t-green-500 bg-base-100 rounded-xl  border-t-[3px]   shadow ')
        } else if (element.status === 'closed') {
            newCard.className = ('border-t-red-500 bg-base-100 rounded-xl  border-t-[3px]   shadow ')
        }
        newCard.innerHTML = `
        <div onclick="modal('${element.id}')" class="">
                        <div class="p-4 shadow space-y-3">
                            <div class="p-4 shadow space-y-3 h-50">
                                <div class="flex justify-between">
                                    <div>
                                        <img src="./assets/Open-Status.png" alt="">
                                    </div>
                                    <p class="bg-red-100 py-1 px-2 rounded-xl text-xs  text-red-500 font-medium">
                                        ${element.priority}</p>
                                </div>
                                <div class="space-y-2">
                                    <h2 class="font-semibold text-[14px] h-12">${element.title}</h2>
                                    <p class="line-clamp-2 text-xs text-gray ">${element.description}</p>
                                </div>
                                <div class="flex gap-1">
                                    <span
                                        class="bg-red-100 py-1.5 px-2 rounded-xl font-medium text-red-500 text-xs">Bug</span>
                                    <span
                                        class="bg-red-100 py-1.5 px-2 rounded-xl font-medium text-red-500 text-xs">help
                                        wanted</span>
                                </div>

                            </div>
                            <div class="p-4 space-y-2">
                                <p class="text-xs text-gray ">#${element.id} by ${element.author}</p>
                                <p class="text-xs text-gray ">${element.createdAt.slice(0, 10)}</p>
                            </div>
                        </div>



                    </div>
        `
        cardContainer.appendChild(newCard);


    })
    loadingSpinner(false);

}
async function modal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const result = await res.json();
    const data = result.data;
    modalTittle.innerText = data.title;
    modalStatus.innerText = data.status;
    modalName.innerText = data.author;
    modalNameB.innerText = data.author;
    modalDate.innerText = data.createdAt.slice(0, 10);
    modalDes.innerText = data.description;
    modalPriority.innerText = data.priority;
    if (data.status === 'open') {
        modalStatus.classList.add('bg-green-500')
    } else if (data.status === 'closed') {
        modalStatus.classList.add('bg-red-500')
    }

    boxModal.showModal()
}
loadData();