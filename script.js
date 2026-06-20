(() => {
    const MAX_YEARS = 5;
    const MAX_ACTIONS_PER_CYCLE = 2;

    const indicators = {
        learning: {
            label: 'Aprendizaje estudiantil',
            icon: '📘',
            hint: 'Resultado central del liderazgo escolar',
            good: 78,
            warn: 55
        },
        motivation: {
            label: 'Motivación docente',
            icon: '🧑‍🏫',
            hint: 'Compromiso, energía y disposición al cambio',
            good: 74,
            warn: 48
        },
        infrastructure: {
            label: 'Infraestructura',
            icon: '🏗️',
            hint: 'Conectividad, equipamiento y condiciones básicas',
            good: 72,
            warn: 45
        },
        families: {
            label: 'Participación familiar',
            icon: '👨‍👩‍👧‍👦',
            hint: 'Vínculo con madres, padres y cuidadores',
            good: 72,
            warn: 45
        },
        wellbeing: {
            label: 'Bienestar socioemocional',
            icon: '💛',
            hint: 'Contención emocional y protección escolar',
            good: 75,
            warn: 50
        },
        budget: {
            label: 'Presupuesto',
            icon: '💰',
            hint: 'Capacidad de inversión disponible',
            good: 65,
            warn: 35
        },
        stress: {
            label: 'Estrés del director',
            icon: '⚡',
            hint: 'Carga administrativa y desgaste profesional',
            good: 35,
            warn: 60,
            reverse: true
        },
        collective: {
            label: 'Eficacia colectiva docente',
            icon: '🤝',
            hint: 'Capacidad compartida para mejorar el aprendizaje',
            good: 74,
            warn: 52
        },
        climate: {
            label: 'Clima escolar',
            icon: '🌤️',
            hint: 'Conviencia, respeto y cooperación',
            good: 76,
            warn: 52
        },
        innovation: {
            label: 'Innovación pedagógica',
            icon: '🚀',
            hint: 'Nuevas prácticas con foco en el aprendizaje',
            good: 70,
            warn: 40
        }
    };

    const actionCatalog = [
        {
            id: 'training',
            title: 'Formación docente',
            icon: '📚',
            cost: 12,
            description: 'Impulsa aprendizaje profesional para elevar la práctica de aula.',
            effects: {
                learning: 8,
                motivation: 10,
                budget: -12,
                collective: 2,
                stress: -2
            }
        },
        {
            id: 'learningCommunity',
            title: 'Comunidad profesional de aprendizaje',
            icon: '🧩',
            cost: 10,
            description: 'Convierte la evidencia en diálogo pedagógico y colaboración sostenida.',
            effects: {
                collective: 14,
                learning: 8,
                motivation: 4,
                climate: 4,
                budget: -10
            }
        },
        {
            id: 'technology',
            title: 'Equipamiento tecnológico',
            icon: '💻',
            cost: 18,
            description: 'Mejora acceso a conectividad, dispositivos y recursos digitales.',
            effects: {
                infrastructure: 16,
                innovation: 12,
                learning: 4,
                budget: -18
            }
        },
        {
            id: 'socioemotional',
            title: 'Atención socioemocional',
            icon: '🫶',
            cost: 9,
            description: 'Refuerza contención, seguridad emocional y bienestar escolar.',
            effects: {
                wellbeing: 16,
                climate: 12,
                stress: -12,
                learning: 4,
                budget: -9
            }
        },
        {
            id: 'families',
            title: 'Trabajo con familias',
            icon: '🏡',
            cost: 7,
            description: 'Activa el vínculo con las familias para sostener acuerdos y apoyo.',
            effects: {
                families: 16,
                climate: 8,
                wellbeing: 4,
                learning: 4,
                budget: -7
            }
        },
        {
            id: 'administration',
            title: 'Gestión administrativa',
            icon: '📑',
            cost: 0,
            description: 'Ordena trámites, resuelve pendientes y libera capacidad operativa.',
            effects: {
                infrastructure: 10,
                budget: 6,
                stress: 8,
                climate: -2
            }
        },
        {
            id: 'innovationProject',
            title: 'Proyecto de innovación educativa',
            icon: '🛰️',
            cost: 15,
            description: 'Prueba una mejora con riesgo de fracaso y alto potencial de impacto.',
            effects: {
                innovation: 18,
                learning: 10,
                collective: 4,
                budget: -15
            },
            risky: true
        }
    ];

    const eventCatalog = [
        {
            id: 'budgetCut',
            title: 'Recorte presupuestal',
            kind: 'danger',
            weight: 11,
            message: 'La escuela recibe un ajuste presupuestal inesperado y se frena parte del plan anual.',
            apply: (state) => ({
                budget: -18 - (state.indicators.innovation > 65 ? 4 : 0),
                stress: 5,
                infrastructure: -4
            })
        },
        {
            id: 'powerOutage',
            title: 'Corte de energía',
            kind: 'warn',
            weight: 8,
            condition: (state) => state.indicators.infrastructure < 65,
            message: 'Un apagón obliga a suspender actividades digitales y reacomodar el trabajo escolar.',
            apply: () => ({
                infrastructure: -10,
                learning: -5,
                stress: 4,
                innovation: -4
            })
        },
        {
            id: 'noInternet',
            title: 'Falta de internet',
            kind: 'warn',
            weight: 10,
            message: 'Se cae la conectividad y se limita el uso pedagógico de recursos digitales.',
            apply: (state) => ({
                infrastructure: -14,
                innovation: -8,
                learning: -4,
                collective: -2
            })
        },
        {
            id: 'teacherTurnover',
            title: 'Rotación de personal docente',
            kind: 'warn',
            weight: 8,
            condition: (state) => state.indicators.collective < 70,
            message: 'Cambios en la plantilla rompen acuerdos previos y obligan a reconstruir la colaboración.',
            apply: () => ({
                motivation: -12,
                collective: -10,
                learning: -4,
                stress: 6
            })
        },
        {
            id: 'teacherAbsenteeism',
            title: 'Ausentismo docente',
            kind: 'warn',
            weight: 9,
            message: 'El ausentismo interrumpe la continuidad pedagógica y exige reorganizar el trabajo.',
            apply: (state) => ({
                motivation: -10,
                collective: -8,
                learning: -6,
                stress: 6
            })
        },
        {
            id: 'mentalHealthCrisis',
            title: 'Crisis socioemocional estudiantil',
            kind: 'danger',
            weight: 8,
            condition: (state) => state.indicators.wellbeing < 60,
            message: 'Se detectan señales de desgaste emocional en el alumnado y la escuela debe contener de inmediato.',
            apply: () => ({
                wellbeing: -14,
                climate: -10,
                stress: 9,
                learning: -5
            })
        },
        {
            id: 'schoolViolence',
            title: 'Problemas de violencia escolar',
            kind: 'danger',
            weight: 10,
            message: 'Surge una situación de violencia que obliga a reforzar protección y contención.',
            apply: () => ({
                wellbeing: -16,
                climate: -18,
                stress: 10,
                families: -6
            })
        },
        {
            id: 'externalInspection',
            title: 'Inspección o presión administrativa',
            kind: 'warn',
            weight: 7,
            message: 'Llega una supervisión extraordinaria que incrementa trámites y presión por evidencias.',
            apply: () => ({
                stress: 8,
                budget: -4,
                climate: -3,
                infrastructure: -2
            })
        },
        {
            id: 'familyPressure',
            title: 'Incremento de exigencias familiares',
            kind: 'warn',
            weight: 9,
            message: 'Aumentan las solicitudes de atención y seguimiento por parte de las familias.',
            apply: () => ({
                families: -8,
                climate: -4,
                stress: 7,
                wellbeing: -4
            })
        },
        {
            id: 'communityFestival',
            title: 'Festival comunitario exitoso',
            kind: 'good',
            weight: 8,
            condition: (state) => state.indicators.families >= 55,
            message: 'La comunidad se involucra y fortalece vínculos alrededor de metas compartidas.',
            apply: () => ({
                families: 12,
                climate: 8,
                wellbeing: 5,
                learning: 4,
                budget: 2
            })
        },
        {
            id: 'sanitaryEmergency',
            title: 'Emergencia sanitaria',
            kind: 'danger',
            weight: 8,
            message: 'La escuela debe reorganizar rutinas, apoyos y comunicación para cuidar a la comunidad.',
            apply: () => ({
                wellbeing: -18,
                climate: -10,
                learning: -8,
                motivation: -6,
                stress: 11,
                budget: -6
            })
        },
        {
            id: 'teacherMentoring',
            title: 'Acompañamiento entre pares',
            kind: 'good',
            weight: 8,
            condition: (state) => state.indicators.collective >= 55,
            message: 'La observación entre colegas ayuda a mejorar la enseñanza con evidencia concreta.',
            apply: (state) => ({
                collective: 10 + Math.round(state.indicators.collective / 20),
                motivation: 6,
                learning: 7,
                stress: -4
            })
        },
        {
            id: 'academicSuccess',
            title: 'Éxito académico destacado',
            kind: 'good',
            weight: 9,
            message: 'Un grupo logra avances sobresalientes y refuerza la confianza colectiva.',
            apply: (state) => ({
                learning: 12 + Math.round(state.indicators.collective / 18),
                motivation: 6,
                collective: 4,
                climate: 3
            })
        },
        {
            id: 'literacyBreakthrough',
            title: 'Avance lector sobresaliente',
            kind: 'good',
            weight: 7,
            condition: (state) => state.indicators.learning >= 60,
            message: 'La estrategia de aula muestra resultados notables en lectura y comprensión.',
            apply: (state) => ({
                learning: 14 + Math.round(state.indicators.motivation / 25),
                motivation: 5,
                collective: 3,
                climate: 2
            })
        },
        {
            id: 'governmentSupport',
            title: 'Apoyo extraordinario del gobierno',
            kind: 'good',
            weight: 8,
            message: 'Llega un respaldo extra que permite resolver prioridades críticas.',
            apply: () => ({
                budget: 18,
                infrastructure: 8,
                innovation: 6,
                stress: -4
            })
        },
        {
            id: 'innovationNetwork',
            title: 'Red de innovación entre escuelas',
            kind: 'good',
            weight: 7,
            condition: (state) => state.indicators.innovation >= 45,
            message: 'El intercambio con otras escuelas acelera el aprendizaje profesional y la adaptación de buenas prácticas.',
            apply: (state) => ({
                innovation: 12 + Math.round(state.indicators.infrastructure / 30),
                collective: 6,
                learning: 6,
                budget: -2
            })
        }
    ];

    const achievementCatalog = [
        {
            id: 'firstTraining',
            title: 'Primera capacitación docente',
            icon: '📚',
            description: 'Desbloquea tu primera acción de formación profesional.',
            unlock: (state) => state.stats.actions.training > 0
        },
        {
            id: 'connectedSchool',
            title: 'Escuela conectada',
            icon: '🌐',
            description: 'Infraestructura sólida con apuesta digital visible.',
            unlock: (state) => state.indicators.infrastructure >= 75 && state.indicators.innovation >= 55
        },
        {
            id: 'learningCommunity',
            title: 'Comunidad de aprendizaje',
            icon: '🤝',
            description: 'La eficacia colectiva se convierte en hábito institucional.',
            unlock: (state) => state.indicators.collective >= 78
        },
        {
            id: 'lowStress',
            title: 'Estrés bajo durante 3 ciclos',
            icon: '🧘',
            description: 'Mantienes el desgaste del director en niveles manejables.',
            unlock: (state) => state.history.stress.slice(-3).length === 3 && state.history.stress.slice(-3).every((value) => value < 35)
        },
        {
            id: 'learningAbove90',
            title: 'Aprendizaje superior a 90',
            icon: '🏆',
            description: 'La escuela alcanza un desempeño académico sobresaliente.',
            unlock: (state) => state.indicators.learning >= 90
        },
        {
            id: 'transformationalLeadership',
            title: 'Liderazgo transformacional',
            icon: '⭐',
            description: 'La escuela consolida un liderazgo pedagógico de alto impacto.',
            unlock: (state) => state.finalLevel === 'Líder Transformacional'
        }
    ];

    const levelCatalog = [
        { title: 'Director Administrativo', minimum: 0 },
        { title: 'Director Operativo', minimum: 32 },
        { title: 'Líder Escolar', minimum: 50 },
        { title: 'Líder Pedagógico', minimum: 68 },
        { title: 'Líder Transformacional', minimum: 84 }
    ];

    const chartTargets = {
        learning: 'learningChart',
        stress: 'stressChart',
        motivation: 'motivationChart',
        collective: 'collectiveChart'
    };

    const state = createInitialState();
    const refs = {};
    const charts = {};

    function createInitialState() {
        const savedTheme = localStorage.getItem('simulator-theme');
        return {
            year: 1,
            completed: false,
            started: false,
            lastEventId: null,
            lastEventKind: null,
            finalLevel: 'Director Administrativo',
            theme: savedTheme === 'dark' ? 'dark' : 'light',
            selectedActions: new Set(),
            stats: {
                actions: {
                    training: 0,
                    learningCommunity: 0,
                    technology: 0,
                    socioemotional: 0,
                    families: 0,
                    administration: 0,
                    innovationProject: 0
                }
            },
            indicators: {
                learning: 48,
                motivation: 52,
                infrastructure: 44,
                families: 51,
                wellbeing: 55,
                budget: 72,
                stress: 33,
                collective: 42,
                climate: 50,
                innovation: 37
            },
            history: {
                labels: ['Inicio'],
                learning: [48],
                stress: [33],
                motivation: [52],
                collective: [42]
            },
            eventLog: [],
            reports: [],
            unlockedAchievements: []
        };
    }

    function clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }

    function getActionById(actionId) {
        return actionCatalog.find((action) => action.id === actionId);
    }

    function addDelta(snapshot, deltas, multiplier = 1) {
        Object.entries(deltas).forEach(([key, value]) => {
            if (!(key in snapshot.indicators)) {
                return;
            }
            snapshot.indicators[key] = clamp(snapshot.indicators[key] + value * multiplier);
        });
    }

    function baseActionEffect(actionId) {
        const current = state.indicators;

        if (actionId === 'training') {
            const collectiveMultiplier = current.collective >= 70 ? 1.35 : current.collective >= 50 ? 1.1 : 0.85;
            const stressPenalty = current.stress >= 70 ? 0.75 : current.stress >= 50 ? 0.9 : 1;
            const infraPenalty = current.infrastructure < 35 ? 0.85 : 1;
            return {
                learning: Math.round(8 * collectiveMultiplier * stressPenalty * infraPenalty),
                motivation: Math.round(10 * stressPenalty),
                collective: current.collective >= 60 ? 3 : 1,
                stress: -2,
                budget: -12
            };
        }

        if (actionId === 'learningCommunity') {
            const learningBoost = current.learning >= 70 ? 1.25 : current.learning >= 45 ? 1.05 : 0.9;
            const climateBoost = current.climate >= 65 ? 1.2 : 1;
            return {
                collective: Math.round(14 * learningBoost),
                learning: Math.round(8 * learningBoost),
                motivation: 4,
                climate: Math.round(4 * climateBoost),
                budget: -10
            };
        }

        if (actionId === 'technology') {
            const infraMultiplier = current.infrastructure >= 60 ? 1.2 : current.infrastructure >= 35 ? 1 : 0.75;
            const innovationMultiplier = current.stress > 70 ? 0.8 : 1;
            return {
                infrastructure: Math.round(16 * infraMultiplier),
                innovation: Math.round(12 * innovationMultiplier),
                learning: 4,
                budget: -18
            };
        }

        if (actionId === 'socioemotional') {
            const stressFactor = current.stress > 65 ? 1.2 : 1;
            return {
                wellbeing: Math.round(16 * stressFactor),
                climate: Math.round(12 * stressFactor),
                stress: -12,
                learning: 4,
                budget: -9
            };
        }

        if (actionId === 'families') {
            const participationBoost = current.families >= 70 ? 1.2 : 1;
            return {
                families: Math.round(16 * participationBoost),
                climate: 8,
                wellbeing: 4,
                learning: 4,
                budget: -7
            };
        }

        if (actionId === 'administration') {
            const stressTradeoff = current.stress >= 70 ? 10 : current.stress >= 50 ? 8 : 6;
            return {
                infrastructure: 10,
                budget: 6,
                stress: stressTradeoff,
                climate: -2
            };
        }

        if (actionId === 'innovationProject') {
            const failurePressure = (100 - current.infrastructure) * 0.15 + (100 - current.collective) * 0.18 + current.stress * 0.16;
            const successChance = clamp(72 - failurePressure);
            const success = Math.random() * 100 <= successChance;
            const result = {
                innovation: success ? 18 : 5,
                learning: success ? 10 : 4,
                collective: success ? 4 : 0,
                budget: -15,
                stress: success ? -2 : 8,
                climate: success ? 3 : -2
            };
            if (!success) {
                result.innovation = 2;
            }
            return result;
        }

        return {};
    }

    function passiveCycleDynamics() {
        const changes = {};
        const current = state.indicators;

        if (current.collective >= 65 && current.climate >= 65) {
            changes.learning = 4;
            changes.motivation = 3;
        }

        if (current.stress >= 75) {
            changes.motivation = -4;
            changes.climate = -4;
        }

        if (current.budget <= 30) {
            changes.infrastructure = -4;
        }

        if (current.wellbeing < 35) {
            changes.learning = -3;
            changes.climate = -2;
        }

        if (current.innovation >= 70 && current.infrastructure >= 55) {
            changes.learning = (changes.learning || 0) + 3;
        }

        if (current.families >= 70) {
            changes.climate = (changes.climate || 0) + 2;
        }

        return changes;
    }

    function chooseEvent() {
        const pool = eventCatalog.filter((event) => !event.condition || event.condition(state));
        const weightedPool = pool.length > 0 ? pool : eventCatalog;
        const eligible = weightedPool.map((event) => ({
            event,
            weight: adjustedEventWeight(event)
        })).filter(({ weight }) => weight > 0);

        const finalPool = eligible.length > 0 ? eligible : weightedPool.map((event) => ({ event, weight: event.weight }));
        const totalWeight = finalPool.reduce((sum, item) => sum + item.weight, 0);
        let cursor = Math.random() * totalWeight;

        for (const item of finalPool) {
            cursor -= item.weight;
            if (cursor <= 0) {
                return item.event;
            }
        }

        return finalPool[finalPool.length - 1].event;
    }

    function adjustedEventWeight(event) {
        let weight = event.weight;
        const currentYear = state.year;

        if (event.id === state.lastEventId) {
            weight *= 0.25;
        }

        if (event.kind === state.lastEventKind && event.kind !== 'good') {
            weight *= 0.72;
        }

        if (currentYear <= 2) {
            if (event.kind === 'danger') {
                weight *= 0.82;
            }
            if (event.kind === 'good') {
                weight *= 1.08;
            }
        } else if (currentYear >= 4) {
            if (event.kind === 'good') {
                weight *= 1.12;
            }
            if (event.kind === 'danger' && state.indicators.stress > 65) {
                weight *= 1.08;
            }
        }

        if (state.indicators.stress > 75 && event.kind === 'danger') {
            weight *= 0.8;
        }

        if (state.indicators.wellbeing < 40 && event.kind === 'danger') {
            weight *= 0.85;
        }

        if (state.indicators.collective > 70 && event.kind === 'good') {
            weight *= 1.12;
        }

        return Math.max(1, Math.round(weight));
    }

    function weightedScore() {
        const values = state.indicators;
        const positive = (
            values.learning * 0.24 +
            values.motivation * 0.12 +
            values.infrastructure * 0.09 +
            values.families * 0.08 +
            values.wellbeing * 0.13 +
            values.collective * 0.16 +
            values.climate * 0.10 +
            values.innovation * 0.08 +
            values.budget * 0.05
        );
        const negative = values.stress * 0.26;
        return clamp(positive - negative);
    }

    function computeLeadershipLevel(score = weightedScore()) {
        let level = levelCatalog[0].title;
        levelCatalog.forEach((entry) => {
            if (score >= entry.minimum) {
                level = entry.title;
            }
        });

        if (state.indicators.stress > 80 && score < 84) {
            return 'Director Operativo';
        }

        return level;
    }

    function statusForIndicator(key, value) {
        const config = indicators[key];
        if (config.reverse) {
            if (value <= config.good) {
                return 'good';
            }
            if (value <= config.warn) {
                return 'warn';
            }
            return 'danger';
        }

        if (value >= config.good) {
            return 'good';
        }
        if (value >= config.warn) {
            return 'warn';
        }
        return 'danger';
    }

    function formatDelta(value) {
        return `${value > 0 ? '+' : ''}${value}`;
    }

    function buildIndicatorCard(key) {
        const data = indicators[key];
        const value = state.indicators[key];
        const status = statusForIndicator(key, value);
        const width = value;

        return `
            <article class="metric-card" data-indicator="${key}">
                <div class="metric-head">
                    <div>
                        <p class="metric-title">${data.label}</p>
                        <div class="metric-value">${value}<span class="metric-meta">/100</span></div>
                    </div>
                    <div class="metric-icon">${data.icon}</div>
                </div>
                <div class="progress-track" aria-hidden="true">
                    <div class="progress-fill" style="width:${width}%;"></div>
                </div>
                <div class="metric-status ${status}">${status === 'good' ? 'Favorable' : status === 'warn' ? 'Vigilar' : 'Crítico'}</div>
                <p class="metric-meta">${data.hint}</p>
            </article>
        `;
    }

    function renderIndicators() {
        refs.indicatorGrid.innerHTML = Object.keys(indicators).map(buildIndicatorCard).join('');
    }

    function renderActions() {
        const actionsLeft = MAX_ACTIONS_PER_CYCLE - state.selectedActions.size;
        refs.actionsGrid.innerHTML = actionCatalog.map((action) => {
            const selected = state.selectedActions.has(action.id);
            const disabled = state.completed || selected || actionsLeft <= 0 || state.indicators.budget < action.cost;
            const effects = Object.entries(action.effects).map(([key, value]) => `<span class="effect-chip">${indicators[key].icon} ${indicators[key].label}: ${formatDelta(value)}</span>`).join('');
            const budgetLabel = action.cost > 0 ? `Costo ${action.cost}` : 'Sin costo';
            const extraLabel = action.risky ? '<span class="effect-chip">Riesgo de fracaso</span>' : '';

            return `
                <article class="action-card ${selected ? 'selected' : ''}">
                    <div class="action-top">
                        <div>
                            <h3 class="action-title">${action.title}</h3>
                            <p class="action-desc">${action.description}</p>
                        </div>
                        <div class="action-icon">${action.icon}</div>
                    </div>
                    <div class="effect-list">${effects}${extraLabel}</div>
                    <div class="action-footer">
                        <span class="metric-meta">${budgetLabel}</span>
                        <button type="button" data-action-id="${action.id}" ${disabled ? 'disabled' : ''}>${selected ? 'Elegida' : 'Aplicar'}</button>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderHeader() {
        refs.cycleLabel.textContent = `Año ${state.year}`;
        refs.cycleDescription.textContent = cycleDescriptionForYear(state.year);
        refs.budgetValue.textContent = state.indicators.budget;
        refs.scoreValue.textContent = weightedScore();
        refs.leadershipType.textContent = state.finalLevel;
        refs.turnHint.textContent = state.completed
            ? 'El simulador ha concluido. Puedes revisar el informe final o reiniciar.'
            : `Elige hasta ${MAX_ACTIONS_PER_CYCLE} acciones por ciclo. Las respuestas dependen del estado actual.`;
    }

    function renderTutorial() {
        const needs = Object.entries(state.indicators)
            .filter(([key]) => key !== 'budget')
            .sort((a, b) => a[1] - b[1])
            .slice(0, 3)
            .map(([key, value]) => ({ key, value, label: indicators[key].label }));

        const recommendedActions = actionCatalog
            .slice()
            .sort((a, b) => {
                const scoreA = scoreActionForState(a);
                const scoreB = scoreActionForState(b);
                return scoreB - scoreA;
            })
            .slice(0, 2);

        const currentFocus = state.year <= 2
            ? 'Construye bases sólidas: colaboración, bienestar y participación.'
            : state.year <= 4
                ? 'Escala la eficacia colectiva y usa la innovación con prudencia.'
                : 'Cierra con evidencia: consolida lo que sí elevó el aprendizaje.';

        refs.tutorialHint.textContent = currentFocus;
        refs.tutorialContent.innerHTML = `
            <article class="tutorial-item">
                <h3>Prioridades críticas</h3>
                <p>Estos son los tres indicadores más débiles de la escuela en este momento.</p>
                <ul>
                    ${needs.map((item) => `<li>${item.label}: ${item.value}/100</li>`).join('')}
                </ul>
                <span class="tutorial-kpi">Enfoque: equilibrio antes que expansión</span>
            </article>
            <article class="tutorial-item">
                <h3>Acciones sugeridas</h3>
                <p>La guía prioriza decisiones con mejor relación entre costo e impacto para el estado actual.</p>
                <ul>
                    ${recommendedActions.map((action) => `<li>${action.title}</li>`).join('')}
                </ul>
                <span class="tutorial-kpi">Consejo: observa presupuesto y estrés</span>
            </article>
            <article class="tutorial-item">
                <h3>Meta del ciclo</h3>
                <p>${currentFocus}</p>
                <ul>
                    <li>Aplica hasta ${MAX_ACTIONS_PER_CYCLE} acciones.</li>
                    <li>Cierra el ciclo para ver el reporte anual.</li>
                    <li>Los eventos aleatorios modificarán la estrategia.</li>
                </ul>
                <span class="tutorial-kpi">Año ${state.year} de ${MAX_YEARS}</span>
            </article>
        `;
    }

    function scoreActionForState(action) {
        const current = state.indicators;
        let score = 0;

        Object.entries(action.effects).forEach(([key, value]) => {
            if (value <= 0 || !(key in current)) {
                return;
            }
            const needWeight = 100 - current[key];
            score += value * (needWeight / 10);
        });

        score -= action.cost * 0.7;
        if (action.risky) {
            score -= current.stress > 60 ? 4 : 1;
        }

        return score;
    }

    function cycleDescriptionForYear(year) {
        const descriptions = {
            1: 'Primer ciclo escolar: diagnostica prioridades y construye bases para el cambio.',
            2: 'Segundo ciclo: fortalece colaboración docente y participación de familias.',
            3: 'Tercer ciclo: consolida la eficacia colectiva y corrige los cuellos de botella.',
            4: 'Cuarto ciclo: acelera la innovación, cuida el clima y profundiza el aprendizaje.',
            5: 'Quinto ciclo: sostiene los avances y prepara el cierre con visión transformacional.'
        };
        return descriptions[year] || 'Ciclo finalizado.';
    }

    function eventEntryTemplate(event) {
        return `
            <article class="event-card">
                <div class="event-head">
                    <h3>${event.title}</h3>
                    <span class="event-chip ${event.kind}">${event.kind === 'good' ? 'Oportunidad' : event.kind === 'warn' ? 'Reto' : 'Crisis'}</span>
                </div>
                <p class="event-text">${event.message}</p>
                <p class="event-meta">${event.summary}</p>
            </article>
        `;
    }

    function buildAnnualReport(report) {
        return `
            <article class="report-card">
                <div class="report-head">
                    <h3>${report.title}</h3>
                    <span class="badge-state">${report.level}</span>
                </div>
                <p class="report-text">${report.summary}</p>
                <div class="report-grid">
                    <div class="report-box">
                        <h4>Fortalezas</h4>
                        <p>${report.strengths.join(' · ')}</p>
                    </div>
                    <div class="report-box">
                        <h4>Debilidades</h4>
                        <p>${report.weaknesses.join(' · ')}</p>
                    </div>
                    <div class="report-box">
                        <h4>Recomendaciones</h4>
                        <p>${report.recommendations.join(' · ')}</p>
                    </div>
                </div>
            </article>
        `;
    }

    function buildFinalReport() {
        const score = weightedScore();
        const level = computeLeadershipLevel(score);
        state.finalLevel = level;

        const evolution = ['learning', 'stress', 'motivation', 'collective'].map((key) => {
            const label = indicators[key].label;
            const history = state.history[key];
            return `<li>${label}: ${history[0]} → ${history[history.length - 1]}</li>`;
        }).join('');

        const achievements = state.unlockedAchievements.length > 0
            ? state.unlockedAchievements.map((id) => {
                const badge = achievementCatalog.find((item) => item.id === id);
                return badge ? `• ${badge.title}` : '';
            }).join('<br>')
            : 'Sin logros desbloqueados todavía.';

        const recommendation = finalRecommendation(level, score);
        const message = motivationalMessage(level, score);

        refs.finalReport.innerHTML = `
            <section class="final-summary">
                <span class="leadership-tag">${level}</span>
                <h3>Puntuación final: ${score}/100</h3>
                <p>Clasificación final del simulador: ${level}.</p>
                <ul>
                    ${evolution}
                </ul>
                <p><strong>Logros:</strong><br>${achievements}</p>
                <p><strong>Recomendaciones:</strong> ${recommendation}</p>
                <p><strong>Mensaje motivacional:</strong> ${message}</p>
            </section>
        `;
    }

    function finalRecommendation(level, score) {
        const base = {
            'Director Administrativo': 'Consolida una ruta mínima de liderazgo pedagógico antes de expandir acciones.',
            'Director Operativo': 'Prioriza eficacia colectiva, clima escolar y seguimiento de aprendizajes.',
            'Líder Escolar': 'Sostén la colaboración docente y la participación familiar con metas claras.',
            'Líder Pedagógico': 'Profundiza innovación y uso de evidencia para mejorar el aula.',
            'Líder Transformacional': 'Comparte práctica, escala innovación y convierte la escuela en referente.'
        };

        if (score < 35) {
            return `${base[level]} Además, reduce la carga administrativa y estabiliza el bienestar.`;
        }
        if (score < 70) {
            return `${base[level]} Aún hay margen para subir aprendizaje y eficacia colectiva.`;
        }
        return `${base[level]} Tu escuela ya muestra condiciones para sostener la mejora continua.`;
    }

    function motivationalMessage(level, score) {
        if (level === 'Líder Transformacional') {
            return 'La transformación educativa ocurre cuando el liderazgo deja de administrar carencias y empieza a construir futuro con la comunidad.';
        }
        if (score >= 70) {
            return 'La escuela avanza porque el liderazgo convirtió las decisiones difíciles en aprendizaje compartido.';
        }
        if (score >= 45) {
            return 'El progreso es visible: sigue alineando recursos, bienestar y foco pedagógico.';
        }
        return 'Toda transformación empieza por sostener a la comunidad y elegir mejor las prioridades.';
    }

    function determineReportSnapshot(eventTitle) {
        const values = state.indicators;
        const strengths = [];
        const weaknesses = [];
        const recommendations = [];

        const ranking = Object.entries(values).sort((a, b) => b[1] - a[1]);
        strengths.push(`${indicators[ranking[0][0]].label} (${ranking[0][1]})`);
        strengths.push(`${indicators[ranking[1][0]].label} (${ranking[1][1]})`);

        const weakest = Object.entries(values)
            .filter(([key]) => key !== 'budget')
            .sort((a, b) => a[1] - b[1])
            .slice(0, 2);
        weaknesses.push(`${indicators[weakest[0][0]].label} (${weakest[0][1]})`);
        weaknesses.push(`${indicators[weakest[1][0]].label} (${weakest[1][1]})`);

        if (values.learning < 60) recommendations.push('Reforzar prácticas de aula y seguimiento pedagógico.');
        if (values.collective < 60) recommendations.push('Instalar más comunidades profesionales de aprendizaje.');
        if (values.stress > 60) recommendations.push('Reducir carga administrativa y fortalecer autocuidado.');
        if (values.infrastructure < 50) recommendations.push('Priorizar infraestructura y conectividad.');
        if (values.families < 55) recommendations.push('Mejorar comunicación y trabajo colaborativo con familias.');
        if (values.wellbeing < 55) recommendations.push('Aumentar contención socioemocional para cuidar a la comunidad.');
        if (recommendations.length === 0) recommendations.push('Sostener las prácticas actuales y escalar la innovación.');

        return {
            title: `Reporte del ${eventTitle}`,
            level: computeLeadershipLevel(),
            summary: `Cierre del ${cycleDescriptionForYear(state.year)}. La escuela respondió a ${eventTitle.toLowerCase()}.`,
            strengths,
            weaknesses,
            recommendations
        };
    }

    function logMessage(message, summary = '') {
        state.eventLog.unshift({ message, summary });
        state.eventLog = state.eventLog.slice(0, 4);
        refs.eventLog.innerHTML = state.eventLog.map((entry) => `
            <article class="event-card">
                <div class="event-head">
                    <h3>${entry.message}</h3>
                    <span class="event-chip good">Registro</span>
                </div>
                <p class="event-meta">${entry.summary}</p>
            </article>
        `).join('');
    }

    function applyOutcome(changes) {
        Object.entries(changes).forEach(([key, value]) => {
            if (key in state.indicators) {
                state.indicators[key] = clamp(state.indicators[key] + value);
            }
        });
    }

    function tunedEventOutcome(event, changes) {
        const tunedChanges = { ...changes };

        if (event.kind === 'danger') {
            let damageFactor = state.year <= 2 ? 0.88 : 0.95;

            if (state.selectedActions.has('socioemotional')) {
                damageFactor += 0.08;
            }

            if (state.selectedActions.has('families')) {
                damageFactor += 0.05;
            }

            if (state.indicators.climate >= 60) {
                damageFactor += 0.04;
            }

            if (state.indicators.collective >= 65) {
                damageFactor += 0.04;
            }

            const severityMultiplier = Math.min(1, damageFactor);

            Object.keys(tunedChanges).forEach((key) => {
                if (tunedChanges[key] < 0) {
                    tunedChanges[key] = Math.round(tunedChanges[key] * severityMultiplier);
                }
            });
        }

        if (event.kind === 'good') {
            const supportBoost = state.selectedActions.has('learningCommunity') || state.selectedActions.has('training') ? 1.08 : 1;
            Object.keys(tunedChanges).forEach((key) => {
                if (tunedChanges[key] > 0) {
                    tunedChanges[key] = Math.round(tunedChanges[key] * supportBoost);
                }
            });
        }

        return tunedChanges;
    }

    function applyAction(actionId) {
        if (state.completed || state.selectedActions.has(actionId) || state.selectedActions.size >= MAX_ACTIONS_PER_CYCLE) {
            return;
        }

        const action = getActionById(actionId);
        if (!action || state.indicators.budget < action.cost) {
            logMessage('No fue posible aplicar la acción por falta de presupuesto.', 'Revisa el balance entre costo e impacto antes de decidir.');
            renderAll();
            return;
        }

        state.selectedActions.add(actionId);
        state.stats.actions[actionId] += 1;
        state.indicators.budget = clamp(state.indicators.budget - action.cost);

        const effect = baseActionEffect(actionId);
        applyOutcome(effect);

        if (actionId === 'innovationProject') {
            const innovationFactor = state.indicators.innovation >= 70 ? 1.15 : 1;
            state.indicators.learning = clamp(state.indicators.learning + Math.round((state.indicators.collective / 24) * innovationFactor));
        }

        logMessage(`Acción aplicada: ${action.title}.`, `Costo ${action.cost}. La respuesta del sistema fue no lineal y dependió del estado actual de la escuela.`);
        renderAll();
    }

    function closeCycle() {
        if (state.completed) {
            return;
        }

        const passiveChanges = passiveCycleDynamics();
        applyOutcome(passiveChanges);

        const selectedEvent = chooseEvent();
        const eventChanges = tunedEventOutcome(selectedEvent, selectedEvent.apply(state));
        applyOutcome(eventChanges);
        state.lastEventId = selectedEvent.id;
        state.lastEventKind = selectedEvent.kind;

        const eventSummaryParts = Object.entries(eventChanges).map(([key, value]) => `${indicators[key].label} ${formatDelta(value)}`).join(' · ');
        state.eventLog.unshift({
            message: `${selectedEvent.title}`,
            summary: `${selectedEvent.message} Impacto: ${eventSummaryParts || 'sin cambios'}.`
        });
        state.eventLog = state.eventLog.slice(0, 4);

        const report = determineReportSnapshot(selectedEvent.title);
        state.reports.push(report);
        refs.annualReport.innerHTML = state.reports.slice(-1).map(buildAnnualReport).join('');

        state.history.labels.push(`Año ${state.year}`);
        state.history.learning.push(state.indicators.learning);
        state.history.stress.push(state.indicators.stress);
        state.history.motivation.push(state.indicators.motivation);
        state.history.collective.push(state.indicators.collective);

        const finalScoreBeforeAdvancing = weightedScore();
        state.finalLevel = computeLeadershipLevel(finalScoreBeforeAdvancing);

        unlockAchievements();
        state.year += 1;
        state.selectedActions = new Set();

        if (state.year > MAX_YEARS) {
            state.completed = true;
            state.finalLevel = computeLeadershipLevel();
            buildFinalReport();
            logMessage('Fin del simulador.', `Nivel alcanzado: ${state.finalLevel}. Puntuación final ${weightedScore()}/100.`);
        } else {
            refs.annualReport.innerHTML = state.reports.map(buildAnnualReport).slice(-1).join('');
        }

        renderAll();
    }

    function unlockAchievements() {
        achievementCatalog.forEach((achievement) => {
            const unlocked = achievement.unlock(state);
            if (unlocked && !state.unlockedAchievements.includes(achievement.id)) {
                state.unlockedAchievements.push(achievement.id);
                logMessage(`Logro desbloqueado: ${achievement.title}.`, achievement.description);
            }
        });
    }

    function renderAchievements() {
        refs.achievementsGrid.innerHTML = achievementCatalog.map((achievement) => {
            const unlocked = state.unlockedAchievements.includes(achievement.id);
            return `
                <article class="badge ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-head">
                        <div class="badge-icon">${achievement.icon}</div>
                        <span class="badge-state">${unlocked ? 'Desbloqueado' : 'Bloqueado'}</span>
                    </div>
                    <h3>${achievement.title}</h3>
                    <p class="badge-lock">${achievement.description}</p>
                </article>
            `;
        }).join('');
    }

    function chartThemePalette() {
        return document.body.dataset.theme === 'dark'
            ? {
                text: '#ecf3ff',
                grid: 'rgba(236, 243, 255, 0.10)',
                fill: 'rgba(114, 170, 255, 0.18)'
            }
            : {
                text: '#10233f',
                grid: 'rgba(16, 35, 63, 0.10)',
                fill: 'rgba(31, 111, 235, 0.15)'
            };
    }

    function createChart(canvasId, label, colorKey, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            return null;
        }

        const palette = chartThemePalette();
        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: state.history.labels,
                datasets: [{
                    label,
                    data,
                    borderColor: colorKey,
                    backgroundColor: palette.fill,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: colorKey,
                    tension: 0.35,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: palette.text,
                            font: {
                                weight: '700'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: palette.text },
                        grid: { color: palette.grid }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { color: palette.text },
                        grid: { color: palette.grid }
                    }
                }
            }
        });
    }

    function renderCharts() {
        const palette = chartThemePalette();
        const chartDefinitions = [
            ['learningChart', 'Aprendizaje', '#1f6feb', state.history.learning],
            ['stressChart', 'Estrés del director', '#d94b57', state.history.stress],
            ['motivationChart', 'Motivación docente', '#6b5cff', state.history.motivation],
            ['collectiveChart', 'Eficacia colectiva', '#1e9e67', state.history.collective]
        ];

        chartDefinitions.forEach(([canvasId, label, color, data]) => {
            if (charts[canvasId]) {
                charts[canvasId].destroy();
            }
            charts[canvasId] = createChart(canvasId, label, color, data);
        });

        Object.values(charts).forEach((chart) => {
            if (!chart) {
                return;
            }
            chart.options.plugins.legend.labels.color = palette.text;
            chart.options.scales.x.ticks.color = palette.text;
            chart.options.scales.y.ticks.color = palette.text;
            chart.options.scales.x.grid.color = palette.grid;
            chart.options.scales.y.grid.color = palette.grid;
            chart.data.labels = state.history.labels;
            chart.update();
        });
    }

    function renderTheme() {
        document.documentElement.dataset.theme = state.theme;
        document.body.dataset.theme = state.theme;
        refs.themeToggle.textContent = state.theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
    }

    function renderOnboarding() {
        const overlayVisible = !state.started && !state.completed;
        refs.onboardingOverlay.classList.toggle('hidden', !overlayVisible);
        document.body.classList.toggle('modal-open', overlayVisible);
    }

    function updateFinalLevel() {
        state.finalLevel = computeLeadershipLevel();
    }

    function renderAll() {
        updateFinalLevel();
        renderTheme();
        renderOnboarding();
        renderHeader();
        renderTutorial();
        renderIndicators();
        renderActions();
        renderAchievements();
        renderCharts();
        if (state.reports.length > 0) {
            refs.annualReport.innerHTML = buildAnnualReport(state.reports[state.reports.length - 1]);
        }
        if (state.completed) {
            buildFinalReport();
        }
        refs.scoreValue.textContent = weightedScore();
        refs.leadershipType.textContent = state.finalLevel;
        refs.budgetValue.textContent = state.indicators.budget;
        refs.eventLog.innerHTML = state.eventLog.map((entry) => `
            <article class="event-card">
                <div class="event-head">
                    <h3>${entry.message}</h3>
                    <span class="event-chip good">Registro</span>
                </div>
                <p class="event-meta">${entry.summary}</p>
            </article>
        `).join('');
    }

    function resetGame() {
        const fresh = createInitialState();
        state.year = fresh.year;
        state.completed = fresh.completed;
        state.started = fresh.started;
        state.finalLevel = fresh.finalLevel;
        state.theme = fresh.theme;
        state.selectedActions = fresh.selectedActions;
        state.stats = fresh.stats;
        state.indicators = fresh.indicators;
        state.history = fresh.history;
        state.eventLog = fresh.eventLog;
        state.reports = fresh.reports;
        state.unlockedAchievements = fresh.unlockedAchievements;
        renderAll();
    }

    function bindEvents() {
        refs.actionsGrid.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-action-id]');
            if (!button) {
                return;
            }
            applyAction(button.dataset.actionId);
        });

        refs.advanceButton.addEventListener('click', closeCycle);
        refs.restartButton.addEventListener('click', resetGame);
        refs.guideToggle.addEventListener('click', () => {
            state.started = false;
            renderAll();
        });
        refs.startGameButton.addEventListener('click', () => {
            state.started = true;
            renderAll();
        });
        refs.themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('simulator-theme', state.theme);
            renderAll();
        });
    }

    function cacheRefs() {
        refs.indicatorGrid = document.getElementById('indicatorGrid');
        refs.actionsGrid = document.getElementById('actionsGrid');
        refs.eventLog = document.getElementById('eventLog');
        refs.annualReport = document.getElementById('annualReport');
        refs.finalReport = document.getElementById('finalReport');
        refs.themeToggle = document.getElementById('themeToggle');
        refs.restartButton = document.getElementById('restartButton');
        refs.advanceButton = document.getElementById('advanceButton');
        refs.guideToggle = document.getElementById('guideToggle');
        refs.startGameButton = document.getElementById('startGameButton');
        refs.onboardingOverlay = document.getElementById('onboardingOverlay');
        refs.cycleLabel = document.getElementById('cycleLabel');
        refs.cycleDescription = document.getElementById('cycleDescription');
        refs.leadershipType = document.getElementById('leadershipType');
        refs.scoreValue = document.getElementById('scoreValue');
        refs.budgetValue = document.getElementById('budgetValue');
        refs.turnHint = document.getElementById('turnHint');
        refs.tutorialHint = document.getElementById('tutorialHint');
        refs.tutorialContent = document.getElementById('tutorialContent');
        refs.achievementsGrid = document.getElementById('achievementsGrid');
    }

    function init() {
        cacheRefs();
        bindEvents();
        renderAll();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
