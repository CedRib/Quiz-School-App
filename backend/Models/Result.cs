namespace prid_2324_a13.Models;


public class Result
{

    public string? WrongQuery { get; set; }

    public List<string>? ErrorList { get; set; }

    public int? Row { get; set; }
    public int? Column { get; set; }

    public string[]? ColumnsLabel { get; set; }

    public bool IsCorrect { get; set; }

    public string[][]? Data { get; set; }

    public List<string>? CompareData(Result expectedResult) {
        ErrorList = new List<string>();

        if (expectedResult.Data!.Length != Data!.Length) {
            ErrorList.Add("Bad number of rows");
        }

        if (expectedResult.Data[0].Length != Data[0].Length) {
            ErrorList.Add("Bad number of columns");
        }

        if (ErrorList.Count == 0) {
            List<string> expectedResultFlat = expectedResult.Data.SelectMany(row => row).Select(value => value?.ToString() ?? "").OrderBy(value => value).ToList();
            List<string> dataFlat = Data.SelectMany(row => row).Select(value => value?.ToString() ?? "").OrderBy(value => value).ToList();

            for (int i = 0; i < expectedResultFlat.Count; i++) {
                if (expectedResultFlat[i] != dataFlat[i]) {
                    ErrorList.Add("Wrong data");
                    break;
                }
            }
        }

        return ErrorList;
    }


}

