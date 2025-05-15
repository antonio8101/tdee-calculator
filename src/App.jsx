import './App.css'
import { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function App() {

    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('M');
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [activityLevel, setActivityLevel] = useState('');
    const [kgPerMonth, setKgPerMonth] = useState('');

    const [submitted, setSubmitted] = useState(false);

    const isMale = gender === 'M';

    const isValidInput = () =>
        age && age > 0 && weight && weight > 0 && height && height > 0 && (gender === 'M' || gender === 'F');

    const calculateBMR = () => {
        if (!isValidInput()) return null;

        const w = weight;
        const h = height;
        const a = age;

        if (gender === 'M') {
            return 10 * w + 6.25 * h - 5 * a + 5;
        } else {
            return 10 * w + 6.25 * h - 5 * a - 161;
        }
    };

    const getActivityMultiplier = () => {
        switch (activityLevel) {
            case 'sedentary':
                return 1.2;
            case 'light':
                return 1.375;
            case 'moderate':
                return 1.55;
            case 'intense':
                return 1.725;
            default:
                return 1; // fallback neutro
        }
    };

    const bmrValue = calculateBMR();
    const tdeeValue = bmrValue * getActivityMultiplier();

    const bmrFormula = isMale
        ? `\\text{BMR} = 10 \\cdot ${weight} + 6.25 \\cdot ${height} - 5 \\cdot ${age} + 5`
        : `\\text{BMR} = 10 \\cdot ${weight} + 6.25 \\cdot ${height} - 5 \\cdot ${age} - 161`;

    const tdeeFormulaRaw = `\\text{TDEE} = ${Math.round(bmrValue)}  \\, (\\text{BMR}) \\cdot ${getActivityMultiplier()} \\, (\\text{attività})`;

    const deficit = (kgPerMonth * 7000) / 30

    const tdeeFinalValue = tdeeValue - deficit;

    const tdeeFinalFormulaRaw = `\\text{TDEE finale} = ${Math.round(tdeeValue)}\\, (\\text{BMR}) -\\, ${Math.round(deficit)}  (\\text{Deficit}) = ${Math.round(tdeeFinalValue)}\\,\\text{kcal}`;

    const renderedFormula = katex.renderToString(bmrFormula, {
        throwOnError: false,
    });
    const renderedTDEE = katex.renderToString(tdeeFormulaRaw, {
        throwOnError: false,
    });
    const renderedTdeeFinalFormula = katex.renderToString(tdeeFinalFormulaRaw, {
        throwOnError: false,
    });

    return (
    <>
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto gap-6 flex-responsive">

                {/* Formula */}
                <div className="chalkboard md:w-1/2 bg-white shadow rounded">
                    <h1 className="chalk-font">Calcoliamo il nostro target energetico!</h1>
                    <hr className="chalk-font" />
                    <h2 className="chalk-font">La formula del BMR, TDEE, e Target Kcal giornaliero:</h2>

                    <div className="formula" dangerouslySetInnerHTML={{ __html: renderedFormula }} />

                    <div
                        className="formula mt-6"
                        dangerouslySetInnerHTML={{ __html: renderedTDEE }}
                    />

                    <div
                        className="formula pb-6 mt-6"
                        dangerouslySetInnerHTML={{ __html: renderedTdeeFinalFormula }}
                    />

                </div>

                <div className="form-container md:w-1/2 bg-white p-6 shadow rounded">
                {submitted && isValidInput()  ? (
                    <div className="result">
                        <p>Per perdere {kgPerMonth} Kg al mese devi assumere al massimo:</p>
                        <p className="target font-mono"><span className="font-bold">{Math.round(tdeeFinalValue)} kcal</span><br />al giorno</p>

                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Ricalcola
                        </button>
                    </div>
                ) : (

                        <div className="form">
                            <h2 className="text-xl font-semibold mb-4">Inserisci i tuoi dati:</h2>
                            <div className="mb-4">
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                Età (anni)
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                Sesso
                            </label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleziona...</option>
                                <option value="M">Maschio</option>
                                <option value="F">Femmina</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                Altezza (cm)
                            </label>
                            <input
                                type="number"
                                id="height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                                Livello di attività fisica
                            </label>
                            <select
                                id="activity"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleziona...</option>
                                <option value="sedentary">Sedentario</option>
                                <option value="light">Leggero (1-3 giorni a settimana)</option>
                                <option value="moderate">Moderato (3-5 giorni)</option>
                                <option value="intense">Intenso (6-7 giorni)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="kgPerMonth" className="block text-sm font-medium text-gray-700">
                                Obiettivo: kg da perdere al mese
                            </label>
                            <select
                                id="kgPerMonth"
                                value={kgPerMonth}
                                onChange={(e) => setKgPerMonth(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">Seleziona...</option>
                                {[1, 2, 3].map((kg) => (
                                    <option key={kg} value={kg}>{kg} kg</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSubmitted(true)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Calcola
                        </button>
                    </div>


                )}

                </div>

            </div>
        </div>
    </>
  )
}

export default App
