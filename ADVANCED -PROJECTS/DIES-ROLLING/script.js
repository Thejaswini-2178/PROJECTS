document.addEventListener('DOMContentLoaded', () => {
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const rollButton = document.getElementById('rollButton');
    const resultElement = document.getElementById('result');

    // Function to roll a single die
    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Function to update dice face based on value
    function updateDiceFace(diceElement, value) {
        // Clear existing dots
        diceElement.innerHTML = '';

        // Create dots based on dice value
        switch (value) {
            case 1:
                diceElement.innerHTML = '<div class="dot center"></div>';
                break;
            case 2:
                diceElement.innerHTML = `
                    <div class="dot top-left"></div>
                    <div class="dot bottom-right"></div>
                `;
                break;
            case 3:
                diceElement.innerHTML = `
                    <div class="dot top-left"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-right"></div>
                `;
                break;
            case 4:
                diceElement.innerHTML = `
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                `;
                break;
            case 5:
                diceElement.innerHTML = `
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                `;
                break;
            case 6:
                diceElement.innerHTML = `
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot middle-left"></div>
                    <div class="dot middle-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                `;
                break;
        }
    }

    // Function to roll both dice
    function rollDice() {
        // Disable button during animation
        rollButton.disabled = true;
        resultElement.textContent = '';

        // Add rolling animation
        dice1.classList.add('rolling');
        dice2.classList.add('rolling');

        // Roll dice after a short delay for animation
        setTimeout(() => {
            const value1 = rollDie();
            const value2 = rollDie();

            updateDiceFace(dice1, value1);
            updateDiceFace(dice2, value2);

            // Remove rolling animation
            dice1.classList.remove('rolling');
            dice2.classList.remove('rolling');

            // Show result
            resultElement.textContent = `You rolled ${value1 + value2} (${value1} + ${value2})`;

            // Re-enable button
            rollButton.disabled = false;
        }, 1000);
    }

    // Add click event to roll button
    rollButton.addEventListener('click', rollDice);

    // Initialize dice with random values
    rollDice();
});