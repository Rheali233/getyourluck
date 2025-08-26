/**
 * 统一状态管理接口定义
 * 遵循统一开发标准中的ModuleState规范
 */
export interface ModuleState {
    isLoading: boolean;
    error: string | null;
    data: any;
    lastUpdated: Date | null;
}
export interface ModuleActions {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setData: (data: any) => void;
    reset: () => void;
}
export interface TestModuleState extends ModuleState {
    currentTest: string | null;
    currentQuestion: number;
    answers: any[];
    result: any | null;
    progress: number;
}
export interface TestModuleActions extends ModuleActions {
    startTest: (testType: string) => void;
    submitAnswer: (answer: any) => void;
    nextQuestion: () => void;
    calculateResult: () => Promise<void>;
    resetTest: () => void;
}
