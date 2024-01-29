

export class Result {

    public trueQueryOne!: string;
    public trueQueryTwo!: string;
    public falseQuery!: string;
    public wrongQueryTitle!: string;
    wrongQuery?: string;
    isCorrect?: boolean;

    row?: number;
    column?: number;

    columnsLabel?: string[] = [];

    errorList?: string[] | null;

    data?: string[][];

}