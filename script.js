document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#game-board');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    // ゲームの初期化
    function createBoard() {
        // マインをランダムに配置
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() -0.5);

        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add('cell'); 
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // 通常のクリック
            square.addEventListener('click', function(e) {
                click(square);
            });

            // 右クリックイベントリスナーを追加
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        // 数を計算する
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width -1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++;
                if (i > 10 && squares[i -width].classList.contains('bomb')) total++;
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total++;
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++;
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++;
                if (i < 89 && squares[i +width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    // クリック時の処理
    function click(square) {
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            square.classList.add('open');
            square.classList.add('mine');
            console.log('Game Over!');
            isGameOver = true;
            alert("lose")
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.innerHTML = total;
                square.classList.add('open');
                return;
            }
            // 数が0の場合は隣接するセルも開く
            square.classList.add('open');
            checkSquare(square, false);
        }
    }

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                flags++;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = ''; // フラグを削除
                flags--;
            }
        }
    }

    // 隣接するセルをチェック
    function checkSquare(square) {
        const isLeftEdge = square.id % width === 0;
        const isRightEdge = square.id % width === width - 1;
        setTimeout(() => {
            if (square.id > 0 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id > 9 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id > 10) {
                const newId = squares[parseInt(square.id - width)].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id > 11 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id < 98 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id < 90 && !isLeftEdge) {
                const newId = squares[parseInt(square.id) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id < 88 && !isRightEdge) {
                const newId = squares[parseInt(square.id) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
            if (square.id < 89) {
                const newId = squares[parseInt(square.id) + width].id;
                const newSquare = document.getElementById(newId);
                if (!newSquare.classList.contains('open')) click(newSquare);
            }
        }, 10);
    }

    function checkForWin() {
        let matches = 0;
    
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
        }
    
        if (matches === bombAmount) {
            console.log('You win!');
            isGameOver = true;
            // 勝利をユーザーに知らせるための追加のアクションをここに実装...
            alert("win!")
        } else {
            let openedSquares = 0;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].classList.contains('checked') && !squares[i].classList.contains('bomb')) {
                    openedSquares++;
                }
            }
            if (openedSquares === (width * width - bombAmount)) {
                console.log('You win!');
                isGameOver = true;
                alert("win")
            }
        }
    }
});

