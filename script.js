document.addEventListener('DOMContentLoaded', function() {
    // =============== 全局变量 =============== 
    const startDate = new Date('2021-07-02');
    let memories = [];
    let milestones = [];
    let events = [];
    
    // =============== 页面导航 =============== 
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.dataset.page;
            
            // 更新导航按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 显示目标页面
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
        });
    });
    
    // =============== 时间计算器 =============== 
    function updateTimeTogether() {
        const now = new Date();
        const diff = now - startDate;
        
        // 计算时间差
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(months / 12);
        
        // 更新DOM
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months % 12;
        document.getElementById('weeks').textContent = weeks % 4;
        document.getElementById('days').textContent = days % 7;
        document.getElementById('hours').textContent = hours % 24;
        document.getElementById('minutes').textContent = minutes % 60;
        
        // 随机爱的名言
        const quotes = [
            "时光因你而美好",
            "每一秒都更爱你",
            "相爱的每一刻都是永恒",
            "时间在流逝，爱在累积",
            "和你在一起的时光最珍贵",
            "余生请多指教",
            "爱是时间的魔法"
        ];
        document.getElementById('love-quote').textContent = 
            quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    // 每分钟更新一次时间
    updateTimeTogether();
    setInterval(updateTimeTogether, 60000);
    
    // =============== 回忆相册 =============== 
    function initMemoryPage() {
        const grid = document.querySelector('.memory-grid');
        
        // 从本地存储加载回忆数据
        const savedMemories = localStorage.getItem('memories');
        memories = savedMemories ? JSON.parse(savedMemories) : [];
        
        // 生成回忆卡片
        grid.innerHTML = '';
        memories.forEach(memory => {
            const card = createMemoryCard(memory);
            grid.appendChild(card);
        });
        
        // 添加默认卡片
        if (memories.length === 0) {
            const defaultMemories = [
                { 
                    id: Date.now() + 1, 
                    title: "初次相遇", 
                    date: "2021-07-02", 
                    emoji: "📸"
                },
                { 
                    id: Date.now() + 2, 
                    title: "海边日落", 
                    date: "2022-05-15", 
                    emoji: "🏖️"
                }
            ];
            
            defaultMemories.forEach(memory => {
                const card = createMemoryCard(memory);
                grid.appendChild(card);
                memories.push(memory);
            });
            
            // 保存到本地存储
            localStorage.setItem('memories', JSON.stringify(memories));
        }
    }
    
    function createMemoryCard(memory) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = memory.id;
        card.innerHTML = `
            <div class="memory-image">${memory.emoji || '❤️'}</div>
            <div class="memory-content">
                <div class="memory-title">${memory.title}</div>
                <div class="memory-date">${memory.date}</div>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', function() {
            alert(`回忆: ${memory.title}\n日期: ${memory.date}\n点击右上角+添加自己的回忆`);
        });
        
        return card;
    }
    
    // =============== 纪念日管理 =============== 
    function initMilestonesPage() {
        const milestonesList = document.querySelector('.milestones-list');
        
        // 从本地存储加载纪念日数据
        const savedMilestones = localStorage.getItem('milestones');
        milestones = savedMilestones ? JSON.parse(savedMilestones) : [];
        
        // 生成纪念日卡片
        milestonesList.innerHTML = '';
        milestones.forEach(milestone => {
            const card = createMilestoneCard(milestone);
            milestonesList.appendChild(card);
        });
        
        // 添加默认纪念日
        if (milestones.length === 0) {
            const defaultMilestone = {
                id: Date.now(),
                title: "在一起的第一天",
                date: "2021-07-02"
            };
            
            milestones.push(defaultMilestone);
            const card = createMilestoneCard(defaultMilestone);
            milestonesList.appendChild(card);
            saveMilestones();
        }
        
        // 添加纪念日按钮事件
        document.getElementById('add-milestone-btn').addEventListener('click', addMilestone);
    }
    
    function createMilestoneCard(milestone) {
        // 计算纪念日时间差
        const milestoneDate = new Date(milestone.date);
        const now = new Date();
        const diffTime = now - milestoneDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const card = document.createElement('div');
        card.className = 'milestone-card';
        card.dataset.id = milestone.id;
        card.innerHTML = `
            <div class="milestone-title">${milestone.title}</div>
            <div class="milestone-date">${milestoneDate.toLocaleDateString()}</div>
            <div class="milestone-time">已有 ${diffDays} 天</div>
        `;
        
        return card;
    }
    
    function addMilestone() {
        const titleInput = document.getElementById('milestone-title');
        const dateInput = document.getElementById('milestone-date');
        
        if (!titleInput.value.trim()) {
            alert('请输入纪念日名称');
            return;
        }
        
        if (!dateInput.value) {
            alert('请选择日期');
            return;
        }
        
        const newMilestone = {
            id: Date.now(),
            title: titleInput.value,
            date: dateInput.value
        };
        
        milestones.push(newMilestone);
        saveMilestones();
        
        // 添加到页面
        const milestonesList = document.querySelector('.milestones-list');
        const card = createMilestoneCard(newMilestone);
        milestonesList.appendChild(card);
        
        // 清空表单
        titleInput.value = '';
        dateInput.value = '';
        
        alert(`"${newMilestone.title}" 已添加到纪念日！`);
    }
    
    function saveMilestones() {
        localStorage.setItem('milestones', JSON.stringify(milestones));
    }
    
    // =============== 随机事件转盘 =============== 
    function initRandomPage() {
        const eventsList = document.querySelector('.events-list');
        
        // 从本地存储加载事件数据
        const savedEvents = localStorage.getItem('events');
        events = savedEvents ? JSON.parse(savedEvents) : [];
        
        // 生成事件卡片
        eventsList.innerHTML = '';
        events.forEach(event => {
            const card = createEventCard(event);
            eventsList.appendChild(card);
        });
        
        // 添加默认事件
        if (events.length === 0) {
            const defaultEvents = [
                { id: Date.now() + 1, name: "烛光晚餐", category: "浪漫", emoji: "🕯️" },
                { id: Date.now() + 2, name: "一起看日出", category: "冒险", emoji: "🌅" },
                { id: Date.now() + 3, name: "DIY情侣手链", category: "手工", emoji: "📿" },
                { id: Date.now() + 4, name: "情书互换", category: "浪漫", emoji: "💌" },
                { id: Date.now() + 5, name: "双人瑜伽", category: "健康", emoji: "🧘‍♂️" },
                { id: Date.now() + 6, name: "情侣挑战游戏", category: "游戏", emoji: "🎮" }
            ];
            
            defaultEvents.forEach(event => {
                const card = createEventCard(event);
                eventsList.appendChild(card);
                events.push(event);
            });
            
            saveEvents();
            createWheel();
        }
        
        // 添加事件按钮事件
        document.getElementById('add-event-btn').addEventListener('click', addEvent);
        
        // 旋转按钮事件
        document.getElementById('spin-btn').addEventListener('click', spinWheel);
    }
    
    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = event.id;
        card.innerHTML = `
            <div class="event-emoji">${event.emoji || '🎲'}</div>
            <div class="event-content">
                <div class="event-name">${event.name}</div>
                <span class="event-category">${event.category}</span>
            </div>
        `;
        
        return card;
    }
    
    function addEvent() {
        const nameInput = document.getElementById('event-name');
        const categorySelect = document.getElementById('event-category');
        
        if (!nameInput.value.trim()) {
            alert('请输入活动名称');
            return;
        }
        
        const newEvent = {
            id: Date.now(),
            name: nameInput.value,
            category: categorySelect.value
        };
        
        events.push(newEvent);
        saveEvents();
        
        // 添加到页面
        const eventsList = document.querySelector('.events-list');
        const card = createEventCard(newEvent);
        eventsList.appendChild(card);
        
        // 清空表单
        nameInput.value = '';
        categorySelect.value = '浪漫';
        
        // 重新创建转盘
        createWheel();
        
        alert(`"${newEvent.name}" 已添加到活动列表！`);
    }
    
    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
    }
    
    function createWheel() {
        const wheel = document.querySelector('.wheel');
        wheel.innerHTML = '';
        
        // 计算每个扇区的角度
        const sectionAngle = 360 / events.length;
        
        // 创建扇区
        events.forEach((event, index) => {
            const section = document.createElement('div');
            section.className = 'wheel-section';
            section.style.transform = `rotate(${index * sectionAngle}deg)`;
            
            const content = document.createElement('div');
            content.className = 'section-content';
            content.textContent = event.name;
            content.style.color = index % 2 === 0 ? '#ffffff' : '#000000';
            
            section.appendChild(content);
            wheel.appendChild(section);
        });
    }
    
    function spinWheel() {
        const wheel = document.querySelector('.wheel');
        const resultEl = document.getElementById('result');
        const spinBtn = document.getElementById('spin-btn');
        
        // 禁用按钮避免重复点击
        spinBtn.disabled = true;
        spinBtn.textContent = '旋转中...';
        resultEl.textContent = '旋转中...';
        
        // 随机生成旋转角度（至少3圈）
        const spins = 3 + Math.random() * 5;
        const targetDegrees = spins * 360 + Math.floor(Math.random() * 360);
        
        // 应用旋转
        wheel.style.transform = `rotate(${targetDegrees}deg)`;
        wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.1, 1)';
        
        // 结果计算
        setTimeout(() => {
            const normalizedDegrees = (targetDegrees % 360 + 360) % 360;
            const sectionAngle = 360 / events.length;
            const sectionIndex = Math.floor(normalizedDegrees / sectionAngle);
            const selectedEvent = events[events.length - 1 - sectionIndex];
            
            resultEl.textContent = `转出了：${selectedEvent.emoji || '🎯'} ${selectedEvent.name} (${selectedEvent.category})`;
            
            // 显示惊喜信息
            setTimeout(() => {
                const confirmAction = confirm(`转出了：${selectedEvent.name}\n\n是否要开始这个活动？`);
                if (confirmAction) {
                    alert(`太棒了！开始你们的 "${selectedEvent.name}" 活动吧！`);
                }
                
                spinBtn.disabled = false;
                spinBtn.textContent = '旋转转盘';
            }, 1000);
            
        }, 4000);
    }
    
    // =============== 页面初始化 =============== 
    initMemoryPage();
    initMilestonesPage();
    initRandomPage();
    createWheel();
});