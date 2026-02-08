// مصفوفة الأسئلة (نموذج لـ 3 أسئلة - يمكن تكرار الهيكل لـ 30 سؤالاً)
const questions = [
    { id: 1, text: "كم مرة تتفقد هاتفك فور استيقاظك من النوم؟", weight: 3 },
    { id: 2, text: "هل تجد صعوبة في التركيز على قراءة نص طويل لأكثر من 5 دقائق؟", weight: 4 },
    { id: 3, text: "هل تشعر بالحاجة لفتح تطبيق آخر أثناء مشاهدة فيلم أو فيديو؟", weight: 3 },
    // ... أضف باقي الـ 30 سؤالاً هنا بنفس النمط
];

let currentStep = 0;
let userAnswers = [];
const questionsPerPage = 3;

document.getElementById('start-assessment').addEventListener('click', function() {
    const name = document.getElementById('user-name').value;
    if (!name) return alert("يرجى إدخال الاسم للمتابعة البروتوكولية.");
    
    document.getElementById('display-name').innerText = name;
    transitionStep(1, 2);
    renderQuestions();
});

function renderQuestions() {
    const container = document.getElementById('questionnaire-engine');
    container.innerHTML = ""; // مسح المحتوى الحالي
    
    const start = currentStep * questionsPerPage;
    const end = start + questionsPerPage;
    const currentBatch = questions.slice(start, end);

    currentBatch.forEach((q, index) => {
        const questionHtml = `
            <div class="question-card" style="animation-delay: ${index * 0.1}s">
                <p class="question-text">${q.text}</p>
                <div class="options-grid">
                    ${[
                        {label: 'نادراً', val: 0}, 
                        {label: 'أحياناً', val: 5}, 
                        {label: 'غالباً', val: 10}
                    ].map(opt => `
                        <label class="option-card">
                            <input type="radio" name="q${q.id}" value="${opt.val}" onchange="saveAnswer(${q.id}, ${opt.val})">
                            <span class="option-label">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML += questionHtml;
    });

    updateProgressBar();
}

function saveAnswer(qId, value) {
    userAnswers[qId] = value;
}

document.getElementById('next-step').addEventListener('click', function() {
    if (currentStep < (questions.length / questionsPerPage) - 1) {
        currentStep++;
        renderQuestions();
        document.getElementById('current-step').innerText = currentStep + 1;
    } else {
        showResults();
    }
});

function showResults() {
    transitionStep(2, 3); // الانتقال لشاشة التحميل
    
    setTimeout(() => {
        const totalScore = userAnswers.reduce((a, b) => (a || 0) + (b || 0), 0);
        const maxScore = questions.length * 10;
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        document.getElementById('decay-percentage').innerText = percentage + "%";
        document.getElementById('cert-score').innerText = percentage + "%";
        
        // تحريك حلقة النسبة (SVG)
        const circle = document.getElementById('score-fill');
        const offset = 283 - (283 * percentage / 100);
        circle.style.strokeDashoffset = offset;

        transitionStep(3, 4); // الانتقال للنتيجة النهائية
    }, 3000);
}

function transitionStep(from, to) {
    document.getElementById(`step-${from}`).classList.remove('active');
    document.getElementById(`step-${from}`).classList.add('hidden');
    document.getElementById(`step-${to}`).classList.remove('hidden');
    document.getElementById(`step-${to}`).classList.add('active');
}

function updateProgressBar() {
    const progress = ((currentStep + 1) / (questions.length / questionsPerPage)) * 100;
    document.getElementById('main-progress-bar').style.width = `${progress}%`;
}
