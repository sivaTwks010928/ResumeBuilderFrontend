function addExperience(section) {
    const container = document.createElement('div');
    container.className = 'experience';
    container.innerHTML = `
        <label>Title:</label>
        <input type="text" name="${section}[title][]" required placeholder="Enter job title (e.g., 'QA Lead')">
        <label>Duration:</label>
        <input type="text" name="${section}[duration][]" required placeholder="Duration (e.g., 'Jan 2024 - Present')">
        <label>Tech Stack:</label>
        <input type="text" name="${section}[tech_stack][]" required placeholder="List technologies used">
        <div class="descriptions">
            <label>Descriptions:</label>
            <button type="button" onclick="addDescription(this.parentNode, '${section}')">Add Description</button>
        </div>
        <button type="button" onclick="this.parentNode.remove()">Remove Experience</button>
    `;
    addDescription(container.querySelector('.descriptions'), section);
    document.getElementById(section).appendChild(container);
}


function addDescription(container, section) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';
    descriptionDiv.innerHTML = `
        <textarea name="${section}[descriptions][]" required placeholder="Enter a detailed description..."></textarea>
        <button type="button" onclick="this.parentNode.remove()">Remove</button>
    `;
    container.appendChild(descriptionDiv);
}

function addSkill() {
    const container = document.createElement('div');
    container.className = 'skill';
    container.innerHTML = `
        <label>Skill Title:</label>
        <input type="text" name="skills[title][]" required placeholder="Skill Title (e.g., Programming Languages)">
        <label>Skills:</label>
        <input type="text" name="skills[skills][]" required placeholder="Skills (e.g., Java, JavaScript)">
        <button type="button" onclick="this.parentNode.remove()">Remove Skill</button>
    `;
    document.getElementById('skills').appendChild(container);
}


function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('resumeForm');
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        preferred_pronouns: formData.get('preferred_pronouns'),
        role: formData.get('role'),
        summary: formData.get('summary'),
        thoughtworks_experiences: [],
        other_experiences: [],
        skills: []
    };

    document.querySelectorAll('.experience').forEach(experience => {
        const expType = experience.parentNode.id;
        const expData = {
            title: experience.querySelector(`input[name='${expType}[title][]']`).value,
            duration: experience.querySelector(`input[name='${expType}[duration][]']`).value,
            tech_stack: experience.querySelector(`input[name='${expType}[tech_stack][]']`).value,
            descriptions: Array.from(experience.querySelectorAll(`textarea[name='${expType}[descriptions][]']`)).map(desc => desc.value)
        };
        data[expType].push(expData);
    });

    document.querySelectorAll('.skill').forEach(skill => {
        const skillData = {
            title: skill.querySelector("input[name='skills[title][]']").value,
            skills: skill.querySelector("input[name='skills[skills][]']").value
        };
        data.skills.push(skillData);
    });

    fetch('http://3.108.218.191/check/api/resumes/generate-pdf/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const iframe = document.getElementById('pdfPreview');
        iframe.src = url;
    })
    .catch(error => console.error('Error:', error));
}
