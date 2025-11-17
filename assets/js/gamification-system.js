/**
 * Gamification System for NachoWeb3 Blog
 * Achievements, points, badges, and rewards for reader engagement
 */

class GamificationSystem {
    constructor() {
        this.config = {
            enabled: true,
            notifications: true,
            soundEffects: true,
            autoSave: true,
            dailyStreak: true,
            leaderboards: true
        };

        this.achievements = this.initializeAchievements();
        this.userData = this.loadUserData();
        this.activityHistory = [];
        this.currentStreak = 0;
        this.level = this.calculateLevel(this.userData.totalPoints);

        this.init();
    }

    init() {
        this.createGamificationUI();
        this.setupEventListeners();
        this.checkDailyStreak();
        this.startIdleDetection();
        this.showWelcomeNotification();

        console.log('Gamification System initialized - Level', this.level);
    }

    initializeAchievements() {
        return {
            // Reading achievements
            first_read: {
                id: 'first_read',
                name: '📖 Primer Paso',
                description: 'Lee tu primer artículo',
                points: 10,
                icon: '📖',
                category: 'reading',
                unlocked: false
            },
            speed_reader: {
                id: 'speed_reader',
                name: '⚡ Lector Veloz',
                description: 'Lee un artículo en menos de 1 minuto',
                points: 25,
                icon: '⚡',
                category: 'reading',
                unlocked: false
            },
            bookworm: {
                id: 'bookworm',
                name: '🐛 Rata de Biblioteca',
                description: 'Lee 10 artículos',
                points: 100,
                icon: '🐛',
                category: 'reading',
                unlocked: false
            },
            scholar: {
                id: 'scholar',
                name: '🎓 Académico',
                description: 'Lee 50 artículos',
                points: 500,
                icon: '🎓',
                category: 'reading',
                unlocked: false
            },
            marathon_reader: {
                id: 'marathon_reader',
                name: '🏃 Maratonista de Lectura',
                description: 'Lee 100 artículos',
                points: 1000,
                icon: '🏃',
                category: 'reading',
                unlocked: false,
                legendary: true
            },

            // Engagement achievements
            social_butterfly: {
                id: 'social_butterfly',
                name: '🦋 Mariposa Social',
                description: 'Comparte 5 artículos',
                points: 50,
                icon: '🦋',
                category: 'social',
                unlocked: false
            },
            influencer: {
                id: 'influencer',
                name: '📱 Influencer Digital',
                description: 'Comparte 20 artículos',
                points: 200,
                icon: '📱',
                category: 'social',
                unlocked: false
            },
            commentator: {
                id: 'commentator',
                name: '💬 Participativo',
                description: 'Deja 10 comentarios',
                points: 150,
                icon: '💬',
                category: 'engagement',
                unlocked: false
            },
            explorer: {
                id: 'explorer',
                name: '🗺️ Explorador',
                description: 'Visita todas las categorías',
                points: 200,
                icon: '🗺️',
                category: 'engagement',
                unlocked: false
            },

            // Time achievements
            early_bird: {
                id: 'early_bird',
                name: '🐦 Madrugador',
                description: 'Visita el blog entre 6 AM y 8 AM',
                points: 30,
                icon: '🐦',
                category: 'time',
                unlocked: false
            },
            night_owl: {
                id: 'night_owl',
                name: '🦉 Búho Nocturno',
                description: 'Visita el blog entre 10 PM y 2 AM',
                points: 30,
                icon: '🦉',
                category: 'time',
                unlocked: false
            },
            loyal_reader: {
                id: 'loyal_reader',
                name: '💎 Lector Fiel',
                description: 'Visita el blog durante 7 días consecutivos',
                points: 300,
                icon: '💎',
                category: 'time',
                unlocked: false
            },

            // Special achievements
            bug_hunter: {
                id: 'bug_hunter',
                name: '🐛 Cazador de Bugs',
                description: 'Reporta un error en el sitio',
                points: 100,
                icon: '🐛',
                category: 'special',
                unlocked: false
            },
            trendsetter: {
                id: 'trendsetter',
                name: '🔥 Trendsetter',
                description: 'Lee un artículo antes de que se vuelva viral',
                points: 150,
                icon: '🔥',
                category: 'special',
                unlocked: false
            },
            master_analyst: {
                id: 'master_analyst',
                name: '📊 Maestro Analista',
                description: 'Usa todas las herramientas del blog',
                points: 400,
                icon: '📊',
                category: 'special',
                unlocked: false
            },

            // Hidden achievements
            matrix_master: {
                id: 'matrix_master',
                name: '💚 Maestro Matrix',
                description: 'Usa el modo Matrix durante 1 hora',
                points: 150,
                icon: '💚',
                category: 'hidden',
                unlocked: false,
                hidden: true
            },
            keyboard_ninja: {
                id: 'keyboard_ninja',
                name: '🥷 Ninja del Teclado',
                description: 'Usa 10 atajos de teclado diferentes',
                points: 200,
                icon: '🥷',
                category: 'hidden',
                unlocked: false,
                hidden: true
            },
            easter_egg_hunter: {
                id: 'easter_egg_hunter',
                name: '🥚 Cazador de Huevos de Pascua',
                description: 'Encuentra 3 secretos ocultos en el blog',
                points: 250,
                icon: '🥚',
                category: 'hidden',
                unlocked: false,
                hidden: true
            }
        };
    }

    createGamificationUI() {
        // Create points display
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'gamification-points';
        pointsDisplay.innerHTML = `
            <div class="points-header">
                <div class="points-icon">⭐</div>
                <div class="points-info">
                    <div class="points-amount" id="points-amount">${this.userData.totalPoints}</div>
                    <div class="points-label">Puntos</div>
                </div>
                <div class="level-info">
                    <div class="level-badge" id="level-badge">Nivel ${this.level}</div>
                    <div class="level-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="level-progress" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="streak-info" id="streak-info">
                <span class="streak-icon">🔥</span>
                <span class="streak-text">Racha: ${this.currentStreak} días</span>
            </div>
        `;

        // Create achievements panel
        const achievementsPanel = document.createElement('div');
        achievementsPanel.className = 'achievements-panel';
        achievementsPanel.innerHTML = `
            <div class="achievements-header">
                <h3>🏆 Logros</h3>
                <div class="achievements-stats">
                    <div class="stat">
                        <span class="stat-value" id="achievements-unlocked">0</span>
                        <span class="stat-label">Desbloqueados</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${Object.keys(this.achievements).length}</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
            </div>
            <div class="achievements-categories">
                <button class="category-btn active" data-category="all">Todos</button>
                <button class="category-btn" data-category="reading">📖 Lectura</button>
                <button class="category-btn" data-category="social">📱 Social</button>
                <button class="category-btn" data-category="engagement">💬 Participación</button>
                <button class="category-btn" data-category="special">⭐ Especiales</button>
            </div>
            <div class="achievements-grid" id="achievements-grid">
                <!-- Achievements will be populated here -->
            </div>
        `;

        // Add to page
        document.body.appendChild(pointsDisplay);
        document.body.appendChild(achievementsPanel);

        // Populate achievements
        this.populateAchievements();
        this.updatePointsDisplay();
    }

    populateAchievements() {
        const grid = document.getElementById('achievements-grid');
        grid.innerHTML = '';

        Object.values(this.achievements).forEach(achievement => {
            const isUnlocked = this.userData.achievements[achievement.id] || achievement.unlocked;
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            achievementEl.dataset.category = achievement.category;
            achievementEl.dataset.id = achievement.id;

            achievementEl.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} pts</div>
                    ${achievement.legendary ? '<div class="achievement-legendary">⭐ Legendario</div>' : ''}
                </div>
            `;

            if (!achievement.hidden || isUnlocked) {
                grid.appendChild(achievementEl);
            }

            achievementEl.addEventListener('click', () => {
                this.showAchievementDetails(achievement);
            });
        });

        this.updateAchievementsStats();
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterAchievements(btn.dataset.category);
            });
        });

        // Track reading progress
        document.addEventListener('readingProgress', (e) => {
            if (e.detail.progress === 100) {
                this.trackEvent('article_completed', e.detail);
            }
        });

        // Track social sharing
        document.addEventListener('socialShare', (e) => {
            this.trackEvent('social_share', e.detail);
        });

        // Track theme changes
        document.addEventListener('themeChanged', (e) => {
            this.checkHiddenAchievements('theme', e.detail.theme);
        });

        // Track keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                this.trackEvent('keyboard_shortcut', { key: e.key });
            }
        });

        // Track time spent on site
        setInterval(() => {
            this.updateTimeSpent();
        }, 60000); // Every minute

        // Track daily activity
        this.trackDailyActivity();
    }

    trackEvent(eventType, data = {}) {
        const points = this.getPointsForEvent(eventType, data);
        if (points > 0) {
            this.addPoints(points, eventType, data);
        }

        // Check for achievements
        this.checkAchievements(eventType, data);

        // Record activity
        this.activityHistory.push({
            type: eventType,
            data,
            timestamp: Date.now(),
            points
        });

        // Save progress
        if (this.config.autoSave) {
            this.saveUserData();
        }
    }

    getPointsForEvent(eventType, data) {
        const pointValues = {
            'article_completed': 5,
            'article_completed_fast': 10,
            'social_share': 3,
            'comment_posted': 5,
            'category_visited': 2,
            'page_view': 1,
            'keyboard_shortcut': 2,
            'tool_used': 3,
            'session_start': 1,
            'daily_visit': 10
        };

        let points = pointValues[eventType] || 0;

        // Bonus points
        if (eventType === 'article_completed' && data.readingTime < 60) {
            points += 5; // Speed reader bonus
        }

        return points;
    }

    addPoints(points, source, data = {}) {
        this.userData.totalPoints += points;
        this.updatePointsDisplay();
        this.showPointsNotification(points, source);
        this.checkLevelUp();

        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'points_earned', {
                value: points,
                source,
                total_points: this.userData.totalPoints
            });
        }
    }

    updatePointsDisplay() {
        const pointsAmount = document.getElementById('points-amount');
        const levelBadge = document.getElementById('level-badge');
        const levelProgress = document.getElementById('level-progress');

        if (pointsAmount) {
            pointsAmount.textContent = this.userData.totalPoints;
        }

        if (levelBadge) {
            levelBadge.textContent = `Nivel ${this.level}`;
        }

        if (levelProgress) {
            const currentLevelPoints = this.getPointsForLevel(this.level);
            const nextLevelPoints = this.getPointsForLevel(this.level + 1);
            const progress = ((this.userData.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
            levelProgress.style.width = `${progress}%`;
        }
    }

    checkLevelUp() {
        const newLevel = this.calculateLevel(this.userData.totalPoints);
        if (newLevel > this.level) {
            const oldLevel = this.level;
            this.level = newLevel;
            this.showLevelUpNotification(oldLevel, newLevel);
            this.unlockAchievement('level_master', {
                level: newLevel
            });
        }
    }

    calculateLevel(points) {
        // Exponential level progression
        return Math.floor(Math.sqrt(points / 100)) + 1;
    }

    getPointsForLevel(level) {
        return Math.pow(level - 1, 2) * 100;
    }

    checkAchievements(eventType, data) {
        // Reading achievements
        if (eventType === 'article_completed') {
            const articlesRead = this.userData.stats.articlesCompleted || 0;
            if (articlesRead === 0) this.unlockAchievement('first_read');
            if (data.readingTime < 60) this.unlockAchievement('speed_reader');
            if (articlesRead + 1 === 10) this.unlockAchievement('bookworm');
            if (articlesRead + 1 === 50) this.unlockAchievement('scholar');
            if (articlesRead + 1 === 100) this.unlockAchievement('marathon_reader');
        }

        // Social achievements
        if (eventType === 'social_share') {
            const shares = this.userData.stats.socialShares || 0;
            if (shares + 1 === 5) this.unlockAchievement('social_butterfly');
            if (shares + 1 === 20) this.unlockAchievement('influencer');
        }

        // Time achievements
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 8 && !this.userData.stats.earlyBirdUsed) {
            this.unlockAchievement('early_bird');
            this.userData.stats.earlyBirdUsed = true;
        }
        if (hour >= 22 || hour < 2 && !this.userData.stats.nightOwlUsed) {
            this.unlockAchievement('night_owl');
            this.userData.stats.nightOwlUsed = true;
        }

        // Update stats
        this.updateUserDataStats(eventType);
    }

    unlockAchievement(achievementId, data = {}) {
        const achievement = this.achievements[achievementId];
        if (!achievement || this.userData.achievements[achievementId]) return;

        this.userData.achievements[achievementId] = {
            unlockedAt: Date.now(),
            data
        };

        // Add achievement points
        this.addPoints(achievement.points, 'achievement', {
            achievementId,
            achievementName: achievement.name
        });

        // Show notification
        this.showAchievementNotification(achievement);

        // Update UI
        this.populateAchievements();

        // Track achievement
        if (typeof gtag !== 'undefined') {
            gtag('event', 'achievement_unlocked', {
                achievement_id: achievementId,
                achievement_name: achievement.name,
                points: achievement.points
            });
        }

        // Special effects for legendary achievements
        if (achievement.legendary) {
            this.showLegendaryEffect(achievement);
        }

        this.saveUserData();
    }

    showAchievementNotification(achievement) {
        if (!this.config.notifications) return;

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="popup-content">
                    <div class="popup-icon">${achievement.icon}</div>
                    <div class="popup-info">
                        <div class="popup-title">¡Logro Desbloqueado!</div>
                        <div class="popup-name">${achievement.name}</div>
                        <div class="popup-description">${achievement.description}</div>
                        <div class="popup-points">+${achievement.points} puntos</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Sound effect
        if (this.config.soundEffects) {
            this.playAchievementSound();
        }

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    showPointsNotification(points, source) {
        if (!this.config.notifications || points < 5) return;

        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-popup">
                <span class="points-amount">+${points}</span>
                <span class="points-source">${this.getSourceText(source)}</span>
            </div>
        `;

        // Position near points display
        const pointsDisplay = document.querySelector('.gamification-points');
        if (pointsDisplay) {
            const rect = pointsDisplay.getBoundingClientRect();
            notification.style.top = rect.bottom + 10 + 'px';
            notification.style.right = rect.right + 'px';
        } else {
            notification.style.top = '100px';
            notification.style.right = '20px';
        }

        document.body.appendChild(notification);

        // Animate
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    showLevelUpNotification(oldLevel, newLevel) {
        const notification = document.createElement('div');
        notification.className = 'levelup-notification';
        notification.innerHTML = `
            <div class="levelup-popup">
                <div class="levelup-content">
                    <div class="levelup-icon">⬆️</div>
                    <div class="levelup-info">
                        <div class="levelup-title">¡Subiste de Nivel!</div>
                        <div class="levelup-text">Nivel ${oldLevel} → Nivel ${newLevel}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        if (this.config.soundEffects) {
            this.playLevelUpSound();
        }

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    showWelcomeNotification() {
        if (this.userData.totalPoints > 0 || this.userData.visits > 1) return;

        const notification = document.createElement('div');
        notification.className = 'welcome-notification';
        notification.innerHTML = `
            <div class="welcome-popup">
                <div class="welcome-content">
                    <div class="welcome-icon">🎮</div>
                    <div class="welcome-info">
                        <div class="welcome-title">¡Bienvenido a Gamification!</div>
                        <div class="welcome-text">Gana puntos, desbloquea logros y compite</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.userData.lastVisit;

        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastVisit === yesterday) {
                this.currentStreak++;
                this.addPoints(10, 'daily_streak');
            } else {
                this.currentStreak = 1;
            }

            this.userData.lastVisit = today;
            this.userData.currentStreak = this.currentStreak;

            if (this.currentStreak >= 7) {
                this.unlockAchievement('loyal_reader');
            }

            this.updateStreakDisplay();
        }
    }

    checkHiddenAchievements(category, data) {
        if (category === 'theme' && data.theme === 'matrix') {
            // Check for Matrix master achievement
            if (!this.userData.matrixTime) {
                this.userData.matrixTime = 0;
            }
            this.userData.matrixTime += 60000; // Add 1 minute

            if (this.userData.matrixTime >= 3600000) { // 1 hour
                this.unlockAchievement('matrix_master');
            }
        }
    }

    updateStreakDisplay() {
        const streakInfo = document.getElementById('streak-info');
        if (streakInfo) {
            streakInfo.querySelector('.streak-text').textContent = `Racha: ${this.currentStreak} días`;
        }
    }

    filterAchievements(category) {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showAchievementDetails(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-details">
                <div class="details-header">
                    <div class="details-icon">${achievement.icon}</div>
                    <div class="details-title">${achievement.name}</div>
                    <button class="details-close">✕</button>
                </div>
                <div class="details-content">
                    <p class="details-description">${achievement.description}</p>
                    <div class="details-meta">
                        <div class="meta-item">
                            <span class="meta-label">Puntos:</span>
                            <span class="meta-value">+${achievement.points}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Categoría:</span>
                            <span class="meta-value">${this.getCategoryName(achievement.category)}</span>
                        </div>
                        ${achievement.legendary ? '<div class="meta-item legendary">⭐ Legendario</div>' : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.details-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        setTimeout(() => modal.classList.add('show'), 100);
    }

    getCategoryName(category) {
        const names = {
            'reading': 'Lectura',
            'social': 'Social',
            'engagement': 'Participación',
            'time': 'Tiempo',
            'special': 'Especial',
            'hidden': 'Secreto'
        };
        return names[category] || category;
    }

    updateAchievementsStats() {
        const unlocked = document.getElementById('achievements-unlocked');
        const unlockedCount = Object.keys(this.userData.achievements).length;

        if (unlocked) {
            unlocked.textContent = unlockedCount;
        }
    }

    getSourceText(source) {
        const texts = {
            'article_completed': 'Artículo completado',
            'social_share': 'Compartido',
            'achievement': 'Logro desbloqueado',
            'daily_streak': 'Racha diaria'
        };
        return texts[source] || 'Puntos ganados';
    }

    updateUserDataStats(eventType) {
        if (!this.userData.stats) {
            this.userData.stats = {};
        }

        switch (eventType) {
            case 'article_completed':
                this.userData.stats.articlesCompleted = (this.userData.stats.articlesCompleted || 0) + 1;
                break;
            case 'social_share':
                this.userData.stats.socialShares = (this.userData.stats.socialShares || 0) + 1;
                break;
            case 'category_visited':
                this.userData.stats.categoriesVisited = (this.userData.stats.categoriesVisited || 0) + 1;
                break;
        }
    }

    updateTimeSpent() {
        this.userData.totalTimeSpent = (this.userData.totalTimeSpent || 0) + 1;

        // Check for time-based achievements
        if (this.userData.totalTimeSpent === 60) {
            this.addPoints(50, 'time_spent_1h');
        }
    }

    trackDailyActivity() {
        const today = new Date().toDateString();
        if (!this.userData.dailyActivity) {
            this.userData.dailyActivity = {};
        }

        if (!this.userData.dailyActivity[today]) {
            this.userData.dailyActivity[today] = 0;
        }
        this.userData.dailyActivity[today]++;
    }

    startIdleDetection() {
        let idleTime = 0;
        let lastActivity = Date.now();

        const checkIdle = () => {
            const now = Date.now();
            if (now - lastActivity > 300000) { // 5 minutes
                idleTime += 5;

                if (idleTime >= 30) {
                    this.unlockAchievement('idle_master');
                }
            } else {
                idleTime = 0;
            }
            lastActivity = now;
        };

        setInterval(checkIdle, 60000);
    }

    playAchievementSound() {
        // Create a simple achievement sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    playLevelUpSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a triumphant level-up sound
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 100);
        });
    }

    showLegendaryEffect(achievement) {
        // Create special effect for legendary achievements
        const effect = document.createElement('div');
        effect.className = 'legendary-effect';
        effect.innerHTML = `
            <div class="legendary-particles"></div>
            <div class="legendary-rays"></div>
        `;

        document.body.appendChild(effect);

        setTimeout(() => effect.classList.add('active'), 100);
        setTimeout(() => effect.remove(), 5000);
    }

    // Data management
    loadUserData() {
        const saved = localStorage.getItem('nacho_gamification_data');
        return saved ? JSON.parse(saved) : {
            totalPoints: 0,
            level: 1,
            achievements: {},
            visits: 0,
            lastVisit: null,
            currentStreak: 0,
            stats: {},
            totalTimeSpent: 0,
            dailyActivity: {}
        };
    }

    saveUserData() {
        this.userData.visits++;
        this.userData.currentStreak = this.currentStreak;
        localStorage.setItem('nacho_gamification_data', JSON.stringify(this.userData));
    }

    // Public API
    getStats() {
        return {
            points: this.userData.totalPoints,
            level: this.level,
            achievements: Object.keys(this.userData.achievements).length,
            streak: this.currentStreak,
            rank: this.calculateRank()
        };
    }

    calculateRank() {
        const points = this.userData.totalPoints;
        if (points >= 10000) return '👑 Legendario';
        if (points >= 5000) return '🌟 Maestro';
        if (points >= 2000) return '💎 Experto';
        if (points >= 1000) return '🏆 Profesional';
        if (points >= 500) return '⭐ Avanzado';
        if (points >= 200) return '🎯 Intermedio';
        if (points >= 50) return '🌱 Principiante';
        return '👶 Novato';
    }

    resetProgress() {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('nacho_gamification_data');
            this.userData = this.loadUserData();
            this.level = 1;
            this.currentStreak = 0;
            this.populateAchievements();
            this.updatePointsDisplay();
            location.reload();
        }
    }
}

// Gamification Styles
const gamificationStyles = `
<style>
/* Points Display */
.gamification-points {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 15px;
    padding: 1rem 1.5rem;
    backdrop-filter: blur(10px);
    z-index: 1000;
    min-width: 250px;
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.3);
}

.points-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.points-icon {
    font-size: 1.5rem;
}

.points-info {
    flex: 1;
}

.points-amount {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color, #8a2be2);
    line-height: 1;
}

.points-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.level-info {
    text-align: center;
}

.level-badge {
    background: linear-gradient(135deg, var(--primary-color, #8a2be2), var(--secondary-color, #764ba2));
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.level-progress {
    width: 100%;
}

.progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color, #8a2be2), var(--secondary-color, #764ba2));
    border-radius: 3px;
    transition: width 0.5s ease;
}

.streak-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
}

/* Achievements Panel */
.achievements-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 20px;
    padding: 2rem;
    z-index: 10000;
    display: none;
    overflow-y: auto;
    backdrop-filter: blur(20px);
}

.achievements-panel.show {
    display: block;
}

.achievements-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.achievements-header h3 {
    color: white;
    margin: 0;
    font-size: 1.5rem;
}

.achievements-stats {
    display: flex;
    gap: 2rem;
}

.stat {
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color, #8a2be2);
}

.stat-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.achievements-categories {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.category-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.category-btn.active {
    background: var(--primary-color, #8a2be2);
    color: white;
    border-color: var(--primary-color, #8a2be2);
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.achievement-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
}

.achievement-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.3);
}

.achievement-card.unlocked {
    background: rgba(138, 43, 226, 0.1);
    border-color: rgba(138, 43, 226, 0.3);
}

.achievement-card.locked {
    opacity: 0.6;
}

.achievement-icon {
    font-size: 1.5rem;
    width: 40px;
    text-align: center;
}

.achievement-info {
    flex: 1;
    min-width: 0;
}

.achievement-name {
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.achievement-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    line-height: 1.3;
    margin-bottom: 0.5rem;
}

.achievement-points {
    color: var(--primary-color, #8a2be2);
    font-size: 0.8rem;
    font-weight: 600;
}

.achievement-legendary {
    color: #ffd700;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Notifications */
.achievement-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    transform-origin: center;
}

.achievement-popup {
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #000;
    border-radius: 20px;
    padding: 1.5rem 2rem;
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.4);
    min-width: 300px;
    text-align: center;
    transform: scale(0);
    transition: transform 0.3s ease;
}

.achievement-notification.show .achievement-popup {
    transform: scale(1);
}

.popup-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.popup-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.popup-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.popup-description {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
}

.popup-points {
    font-weight: 700;
    font-size: 0.9rem;
}

.points-notification {
    position: fixed;
    background: var(--primary-color, #8a2be2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 9999;
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
}

.points-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.points-source {
    opacity: 0.8;
    margin-left: 0.5rem;
}

.levelup-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
}

.levelup-popup {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #000;
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
    min-width: 350px;
    transform: scale(0);
    transition: transform 0.3s ease;
}

.levelup-notification.show .levelup-popup {
    transform: scale(1);
}

.levelup-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.levelup-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.levelup-text {
    font-size: 1rem;
    font-weight: 600;
}

.welcome-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
}

.welcome-popup {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 15px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    max-width: 300px;
}

.welcome-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.welcome-icon {
    font-size: 2rem;
}

.welcome-title {
    color: white;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.welcome-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

/* Achievement Modal */
.achievement-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.achievement-modal.show {
    opacity: 1;
}

.achievement-details {
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    backdrop-filter: blur(20px);
    position: relative;
}

.details-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.details-icon {
    font-size: 2rem;
}

.details-title {
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
    flex: 1;
    text-align: center;
}

.details-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.details-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.details-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 1.5rem;
}

.details-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.meta-item {
    flex: 1;
    min-width: 120px;
}

.meta-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.meta-value {
    color: var(--primary-color, #8a2be2);
    font-weight: 600;
    display: block;
    margin-top: 0.25rem;
}

.meta-item.legendary {
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}

/* Legendary Effect */
.legendary-effect {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10003;
}

.legendary-particles {
    position: absolute;
    width: 100%;
    height: 100%;
}

.legendary-rays {
    position: absolute;
    width: 100%;
    height: 100%;
}

.legendary-effect.active .legendary-particles::before,
.legendary-effect.active .legendary-particles::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffd700;
    border-radius: 50%;
    animation: legendary-particle 2s ease-out infinite;
}

.legendary-effect.active .legendary-particles::before {
    top: 20%;
    left: 30%;
    animation-delay: 0s;
}

.legendary-effect.active .legendary-particles::after {
    top: 60%;
    right: 25%;
    animation-delay: 0.5s;
}

@keyframes legendary-particle {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(3);
        opacity: 0;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .gamification-points {
        position: static;
        margin: 1rem;
        top: auto;
        left: auto;
        transform: none;
    }

    .achievements-panel {
        width: 95%;
        max-height: 90vh;
        padding: 1rem;
    }

    .achievements-header {
        flex-direction: column;
        text-align: center;
    }

    .achievements-stats {
        justify-content: center;
    }

    .achievements-grid {
        grid-template-columns: 1fr;
    }

    .achievement-popup,
    .levelup-popup {
        min-width: 250px;
        margin: 0 1rem;
    }

    .points-notification {
        right: 10px;
        left: 10px;
        text-align: center;
    }
}

/* Animations */
@keyframes achievement-unlock {
    0% {
        transform: scale(0) rotate(0deg);
    }
    50% {
        transform: scale(1.1) rotate(180deg);
    }
    100% {
        transform: scale(1) rotate(360deg);
    }
}

/* Dark theme support */
body.theme-light .gamification-points {
    background: rgba(255, 255, 255, 0.95);
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .points-label,
body.theme-light .streak-info {
    color: rgba(0, 0, 0, 0.7);
}

body.theme-light .achievement-card {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .achievement-name {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .achievement-description {
    color: rgba(0, 0, 0, 0.7);
}

/* Matrix theme support */
body.theme-matrix .gamification-points {
    border-color: var(--primary-color, #00ff00);
}

body.theme-matrix .points-amount,
body.theme-matrix .progress-fill {
    background: var(--primary-color, #00ff00);
}

body.theme-mirror .level-badge {
    background: linear-gradient(135deg, var(--primary-color, #00ff00), var(--secondary-color, #00cc00));
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .achievement-card,
    .achievement-popup,
    .levelup-popup,
    .points-notification,
    .details-close {
        transition: none;
    }

    .legendary-effect {
        display: none;
    }
}

/* Print styles */
@media print {
    .gamification-points,
    .achievements-panel,
    .achievement-notification,
    .points-notification,
    .levelup-notification {
        display: none !important;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', gamificationStyles);

// Initialize Gamification System
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.gamificationSystem = new GamificationSystem();
        });
    } else {
        window.gamificationSystem = new GamificationSystem();
    }

    // Global access
    window.showAchievements = () => {
        document.querySelector('.achievements-panel').classList.toggle('show');
    };

    window.getGameStats = () => window.gamificationSystem?.getStats();

    window.resetGameProgress = () => window.gamificationSystem?.resetProgress();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}