export type ChartDataType = {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
    legendColors?: Record<string, string>;
}