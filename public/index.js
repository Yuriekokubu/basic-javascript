document.addEventListener('DOMContentLoaded', () => {

    const firstNameInput = document.getElementById('FirstName');
    const lastNameInput = document.getElementById('LastName');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('btnSubmit');
    const tableBody = document.querySelector('table tbody');

    // Function to fetch members and update the table
    async function refreshTable() {
        try {
            const response = await fetch('http://localhost:8000/member');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const members = await response.json();

            // Clear the existing rows
            tableBody.innerHTML = '';

            // Append new rows
            members.forEach(member => {
                appendRow(member);
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to load members. Please try again.');
        }
    }

    // Function to create and append a row to the table
    function appendRow(member) {
        const newRow = document.createElement('tr');
        const rowNumberCell = document.createElement('th');
        const firstNameCell = document.createElement('td');
        const lastNameCell = document.createElement('td');
        const emailCell = document.createElement('td');
        const deleteCell = document.createElement('td');

        rowNumberCell.textContent = member.id;
        firstNameCell.textContent = member.firstname;
        lastNameCell.textContent = member.lastname;
        emailCell.textContent = member.email;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:8000/member/${member.id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Refresh the table after deletion
                refreshTable();
            } catch (error) {
                console.error('There was a problem with the delete operation:', error);
                alert('Failed to delete member. Please try again.');
            }
        });

        deleteCell.appendChild(deleteButton);
        newRow.appendChild(rowNumberCell);
        newRow.appendChild(firstNameCell);
        newRow.appendChild(lastNameCell);
        newRow.appendChild(emailCell);
        newRow.appendChild(deleteCell);

        tableBody.appendChild(newRow);
    }

    // Initial fetch to populate the table
    refreshTable();

    // Add click event listener to the submit button
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;

        if (firstName && lastName && email) {
            try {
                const response = await fetch('http://localhost:8000/member');
                const members = await response.json();

                const nextId = members.length > 0 ? Math.max(...members.map(member => parseInt(member.id))) + 1 : 1;

                const newMember = {
                    id: nextId.toString(),
                    firstname: firstName,
                    lastname: lastName,
                    email: email
                };

                const postResponse = await fetch('http://localhost:8000/member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newMember)
                });

                if (!postResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                // Refresh the table after adding a new member
                refreshTable();

                firstNameInput.value = '';
                lastNameInput.value = '';
                emailInput.value = '';

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to add member. Please try again.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    });
});
