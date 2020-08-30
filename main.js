let correct = 0;
let total = 0;
const totalDraggableItems = 5;
const totalMatchingPairs = 5; // Should be <= totalDraggableItems

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;
let cycleCount = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
initiateGame();


function initiateGame() {
    //    const setOfBrands = getRandomInt(brands.length)
    console.log(cycleCount);
    const randomDraggableBrands = generateRandomItemsArray(totalDraggableItems, brands[cycleCount]);
    const randomDroppableBrands = totalMatchingPairs < totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggableBrands) : randomDraggableBrands;
    const alphabeticallySortedRandomDroppableBrands = [...randomDroppableBrands].sort((a, b) => a.iconName.toLowerCase().localeCompare(b.iconName.toLowerCase()));
    cycleCount += 1;
    if (cycleCount > brands.length - 1) {
        cycleCount = 0;
    }
    // Create "draggable-items" and append to DOM
    for (let i = 0; i < randomDraggableBrands.length; i++) {
        draggableItems.insertAdjacentHTML("beforeend", ` <img src=images/${randomDraggableBrands[i].imgSource} class= "draggable" draggable="true" id = "${randomDraggableBrands[i].brandName}" width = "90px" height = "90px"> `);
    }

    //
    // Create "matching-pairs" and append to DOM
    for (let i = 0; i < alphabeticallySortedRandomDroppableBrands.length; i++) {
        matchingPairs.insertAdjacentHTML("beforeend", `
        <div class="matching-pair">
          <span class="droppable" data-brand="${alphabeticallySortedRandomDroppableBrands[i].brandName}">${alphabeticallySortedRandomDroppableBrands[i].iconName}</span>
        </div>
      `);
    }

    //Setting the event listeners on all the created DOM elements
    // var el = document.getElementById('drag');

    // el.addEventListener("touchstart", handleStart, false);
    // el.addEventListener("touchend", handleEnd, false);
    // el.addEventListener("touchcancel", handleCancel, false);
    // el.addEventListener("touchleave", handleEnd, false);
    // el.addEventListener("touchmove", handleMove, false);

    // function handleStart(event) {
    // Handle the start of the touch
    // }
    document.addEventListener("touchstart", touch2Mouse, true);
    document.addEventListener("touchmove", touch2Mouse, true);
    document.addEventListener("touchend", touch2Mouse, true);

    function touch2Mouse(e) {
        var theTouch = e.changedTouches[0];
        var mouseEv;

        switch (e.type) {
            case "touchstart":
                mouseEv = "mousedown";
                break;
            case "touchend":
                mouseEv = "mouseup";
                break;
            case "touchmove":
                mouseEv = "mousemove";
                break;
            default:
                return;
        }

        var mouseEvent = document.createEvent("MouseEvent");
        mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
        theTouch.target.dispatchEvent(mouseEvent);

        e.preventDefault();
    }
    // ^ Do the same for the rest of the events

    draggableElements = document.querySelectorAll(".draggable");
    droppableElements = document.querySelectorAll(".droppable");

    draggableElements.forEach(elem => {
        elem.addEventListener("dragstart", dragStart);
        //    elem.addEventListener("touchstart", dragStart)
        // elem.addEventListener("drag", drag);
        // elem.addEventListener("dragend", dragEnd);
    });

    droppableElements.forEach(elem => {
        elem.addEventListener("dragenter", dragEnter);
        //    elem.addEventListener
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("dragleave", dragLeave);
        elem.addEventListener("drop", drop);
        //  elem.addEventListener("touchend", drop);
    });
}

// Drag and Drop Functions

//Events fired on the drag target

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id); // or "text/plain"

}

//Events fired on the drop target

function dragEnter(event) {
    if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
        event.target.classList.add("droppable-hover");
    }
}

function dragOver(event) {
    if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
        event.preventDefault();
    }
}

function dragLeave(event) {
    if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
        event.target.classList.remove("droppable-hover");
    }
}

function drop(event) {
    event.preventDefault();
    event.target.classList.remove("droppable-hover");
    const draggableElementBrand = event.dataTransfer.getData("text");
    const droppableElementBrand = event.target.getAttribute("data-brand");

    const isCorrectMatching = draggableElementBrand === droppableElementBrand;
    total++;
    if (isCorrectMatching) {
        const draggableElement = document.getElementById(draggableElementBrand);
        event.target.classList.add("dropped");
        draggableElement.classList.add("dragged");
        draggableElement.setAttribute("draggable", "false");

        event.target.innerHTML = `<img src=${draggableElement.src}  width = "80px" height = "80px">`;
        correct++;
        //<i class="fa fa-${draggableElementBrand}" style="color: ${draggableElement.style.color};"></i>
        //
    }
    scoreSection.style.opacity = 0;
    setTimeout(() => {
        correctSpan.textContent = correct;
        totalSpan.textContent = total;
        scoreSection.style.opacity = 1;
    }, 200);
    if (correct === Math.min(totalMatchingPairs, totalDraggableItems)) { // Game Over!!
        playAgainBtn.style.display = "block";
        setTimeout(() => {
            playAgainBtn.classList.add("play-again-btn-entrance");
        }, 200);
    }
}

// Other Event Listeners
playAgainBtn.addEventListener("click", playAgainBtnClick);

function playAgainBtnClick() {
    playAgainBtn.classList.remove("play-again-btn-entrance");
    correct = 0;
    total = 0;
    draggableItems.style.opacity = 0;
    matchingPairs.style.opacity = 0;
    setTimeout(() => {
        scoreSection.style.opacity = 0;
    }, 100);
    setTimeout(() => {
        playAgainBtn.style.display = "none";
        while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
        while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
        initiateGame();
        correctSpan.textContent = correct;
        totalSpan.textContent = total;
        draggableItems.style.opacity = 1;
        matchingPairs.style.opacity = 1;
        scoreSection.style.opacity = 1;
    }, 500);
}

// Auxiliary functions
function generateRandomItemsArray(n, originalArray) {
    let res = [];
    let clonedArray = [...originalArray];
    if (n > clonedArray.length) n = clonedArray.length;
    for (let i = 1; i <= n; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        res.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return res;
}