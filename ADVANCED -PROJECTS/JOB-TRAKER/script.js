document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const jobForm = document.getElementById('jobForm');
    const companyInput = document.getElementById('company');
    const positionInput = document.getElementById('position');
    const statusInput = document.getElementById('status');
    const appliedDateInput = document.getElementById('appliedDate');
    const notesInput = document.getElementById('notes');
    const jobApplicationsContainer = document.getElementById('jobApplications');
    const statusFilter = document.getElementById('statusFilter');
    const updateBtn = document.getElementById('updateBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    let currentJobId = null;
    let isEditing = false;

    // Initialize the app
    function init() {
        renderJobList();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        jobForm.addEventListener('submit', handleFormSubmit);
        statusFilter.addEventListener('change', renderJobList);
        updateBtn.addEventListener('click', handleUpdate);
        cancelBtn.addEventListener('click', cancelEdit);
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const job = {
            id: isEditing ? currentJobId : Date.now().toString(),
            company: companyInput.value.trim(),
            position: positionInput.value.trim(),
            status: statusInput.value,
            appliedDate: appliedDateInput.value,
            notes: notesInput.value.trim(),
            updatedAt: new Date().toISOString()
        };

        if (isEditing) {
            // Update existing job
            const index = jobs.findIndex(j => j.id === currentJobId);
            if (index !== -1) {
                jobs[index] = job;
            }
        } else {
            // Add new job
            jobs.push(job);
        }

        saveJobs();
        resetForm();
        renderJobList();
    }

    // Handle update button click
    function handleUpdate() {
        jobForm.dispatchEvent(new Event('submit'));
    }

    // Cancel edit mode
    function cancelEdit() {
        resetForm();
    }

    // Reset form to initial state
    function resetForm() {
        jobForm.reset();
        isEditing = false;
        currentJobId = null;
        updateBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        document.querySelector('button[type="submit"]').style.display = 'inline-block';
    }

    // Edit a job
    function editJob(id) {
        const job = jobs.find(j => j.id === id);
        if (job) {
            isEditing = true;
            currentJobId = id;

            companyInput.value = job.company;
            positionInput.value = job.position;
            statusInput.value = job.status;
            appliedDateInput.value = job.appliedDate;
            notesInput.value = job.notes;

            updateBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            document.querySelector('button[type="submit"]').style.display = 'none';

            companyInput.focus();
        }
    }

    // Delete a job
    function deleteJob(id) {
        if (confirm('Are you sure you want to delete this job application?')) {
            jobs = jobs.filter(job => job.id !== id);
            saveJobs();
            renderJobList();

            if (isEditing && currentJobId === id) {
                resetForm();
            }
        }
    }

    // Save jobs to localStorage
    function saveJobs() {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    // Render the job list based on filters
    function renderJobList() {
        const statusFilterValue = statusFilter.value;

        let filteredJobs = [...jobs];
        if (statusFilterValue !== 'All') {
            filteredJobs = jobs.filter(job => job.status === statusFilterValue);
        }

        // Sort by updatedAt (newest first)
        filteredJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        if (filteredJobs.length === 0) {
            jobApplicationsContainer.innerHTML = '<p>No job applications found.</p>';
            return;
        }

        jobApplicationsContainer.innerHTML = filteredJobs.map(job => `
            <div class="job-card">
                <h3>${job.company}</h3>
                <p><strong>Position:</strong> ${job.position}</p>
                <p><strong>Status:</strong> <span class="status-${job.status.toLowerCase()}">${job.status}</span></p>
                <p><strong>Applied Date:</strong> ${formatDate(job.appliedDate)}</p>
                ${job.notes ? `<p><strong>Notes:</strong> ${job.notes}</p>` : ''}
                <div class="job-actions">
                    <button onclick="editJob('${job.id}')">Edit</button>
                    <button onclick="deleteJob('${job.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Make functions available globally for inline event handlers
    window.editJob = editJob;
    window.deleteJob = deleteJob;

    // Initialize the app
    init();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    appliedDateInput.value = today;
});