using Microsoft.Extensions.DependencyInjection;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Domain.Models;

public class User
{
    internal User()
    { }

    public int Id { get; internal set; }
    public string Username { get; internal set; }
    public string Password { get; internal set; }
    public string Email { get; internal set; }
    public decimal Credits { get; internal set; }
    public string ProfilePicture { get; internal set; }
    public bool IsAdmin { get; internal set; }
    public List<Order> Orders { get; internal set; } = [];

    public static User Create(
        int id = 0,
        string username = "",
        string email = "",
        string password = "",
        decimal credits = 0,
        string profilePicture = null,
        bool isAdmin = false)
    {
        using var scope = ServiceLocator.Instance.CreateScope();
        var cryptographyService = scope.ServiceProvider.GetRequiredService<ICryptographyService>();

        return new()
        {
            Id = id,
            Username = (string.IsNullOrWhiteSpace(username) ? string.Empty : username.Trim()).ToLowerInvariant(),
            Email = (string.IsNullOrWhiteSpace(email) ? string.Empty : email.Trim()).ToLowerInvariant(),
            Password = cryptographyService.HashPassword(string.IsNullOrWhiteSpace(password) ? string.Empty : password.Trim()),
            Credits = credits,
            ProfilePicture = string.IsNullOrWhiteSpace(profilePicture)
                ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAh/0lEQVR42uzd/dPldV3H8c/FLuy6wGKi5A2Q6x3Kok4CmmhN5jSZOIumlaUJmSahIjaaZqUikqjgzZSNN5Ojlg1lKAEuex7vFRXlRss0NciFhQG5MQUUsGBhr+tqrukHcQbXvWDPOZ9zzusx8/wXXme+5/v9fr4tIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIifrKBmqNWYBXWVNkLa7EP1i5VZS/ch8EqrBjUYK5FRMR0w0rsg4fiMDwTx+C1OAUfpE7H2disnI8LcJGlygVVzsdmnI3T8UGcgtfgGPw6DsNDsQ9WtoiImAwXfXrTHFZjfxyBo6mTcTouwpXFTbi9ykKVxVKLVfc8LGIBt+MmXIELcTreqrwIR2D/YvU1527MlUtExLh98qyz5rCmeGSxAScW52ALbi41X1WLY24eN+NbVXV2Vb0ZG/AI3GfTuefmByUiYhQYrMJBOAbvxaZSV5faVixWVfdhG67CuXgvjsZB2KNFRMSug9VV1lfVH+EMXI3tajJ+MHYYi9iOq/HPOBbrlVUtIiKWz2CwAuvwB/ikcl1VzXf7Q7CLwjyuxRl4MR6q7NYiImLHsCeeitNwWVVt73Xshx22K1twKp6CNS0iIn5k86DmsJ/yApyN7/c66uMIi7gJZ+F3iv3OOy/voUTEjMOBxavxr8odvY54L2FblS/jBBzQIiJmCVbg4XgVvl5M/b2NId0r+RpeiYdhRYuImFYG5nAQTsEVzO79jV0VtmMr/hKPGshfWxExZZSH4PW4zIS8rzFJWYot+BM8uEVETDplNZ6DL8/CY7jjDvO4GEeVvEsSERNoMBjM4RD8LW7pdXCnNm7Gh7Ceyt9aETEZsA9ega01DW+LT2hYxGU4rljbIiJ6tencwRx1GP6FPJLbUdvwSRxqkJvsEdEZ3Bd/jKs6HdGZD1fieLkaiYhe4GB8Ilcdk5A7lNPxmBYRMS4MVhbPxjfzaO6ExTdKbSiVLydGxGhhLd6Am7odybTj1I14PfZuERGjUOUAfLTyl9XEhzvwYezfIiKGCeuV83odxLT8sIjNOLhFROxqn/v8Z+eqHF5cSJ9DmO5d+CIOvajy4mFE7CIGVijPV7bqdPzSvc9SXI7fJF9BjIh7qdi9eBlu6HX40q4N3yteUgZ5Qisi7hnsgVcVN/c6dmk44Qd4pardW0TEcmAPvAa39jpyabipugWvHpAfkYjYOViBEyo/HjMfbsXx+eJhRPxU59VgDr+NG3sdtTSWeyLPu2TzxjydFRF3b1B2U55XXNPrmKUxxbfxnHwyNyLuFo5Sru92xNLYshTX4lktIuKu8BRc3uuApU5iC57cIiKW4CB8udvRSl2Fi/HIFhGzDQ/AmTmOPe18ljqjuH+LiNmE1XiXstDnUKVuU/N4J1a1iJg9OBr/0+1Ipa7DD/F7LSJmS6nD8a1exylNRrgUh7aImA34WVSvo5QmK2yqqge0iJhuDFbibeS+R9plLeAkOb03YroVG/Id87Srw404skXEdCoOLL7U6wilyQ4X5tvqEVNI1UqcWnnfIw0pZRFvR/7KipgmeKaqnLCbhhs34BktIqYD9qcu7nZ00lSFC/HgFhGTrarm8OY8dZVGFgv480+ffWaOfo+YZDiouKLbsUlTGbbiUS0iJtPmMoeTclBiGnWW4k0bP31OrkIiJhEeh6t6HZk03eFKHNIiYrIUK/BXufpI48ti8e7NrGgRMTmqPKXKd/ocljQ7ub7yBcOIyVFVq5S/63NQ0szFR4o9WkT0D0+tckO3g5JmK76b76hHTIDBwEp8oCr3PlI/4X1lkHshET3D43BNr0OSZjSuzhNZEZ3DW7odkTTb8cYWEX3C/vh6twOSZju+VjkjK6JPOBbz3Q5ImumwHS9pEdEX7A29jkdKS2Ej9mwR0Q/lqcr3ex2OlJZSdVNVHdEioh9VTu51NFK6azixRUQfquxZVZt7HYyU7hpgTYuI8cPjyblXaULiuso7IRF9wKty6m6alLCIV7SIGC+swcZexyKluwtnY3WLiPHBwbi216FI6e5Svq08ukXE+OBFqvLyYJqolO343RYR4zEYbNwNH+h1JFL6SVmK9527aVO+mR4xDtgX/9brSKS0o/Al3K9FxOjhMNzY60CktKNwA57QImL08IdVFnodiJR2FBbw4hYRozX4jDnl/b2OQ0o/PYv46xYRo1VVe1fV+X0OQ0o7Fz6LvVpEjA4eXlzV6zCktFNxBda1iBgdPA0/7HYYUtqJcCt+qUXE6OAl9DkKKe10LBTHtIgYHZxSlQMU01T01hYRo4GV+ESnY5DSssLpA1a2iBg+rMWFvQ5CSssJX8DeLSKGD/tjS6+DkNJywqV4UIuI4cMh+O9eByGl5YTr8ZgWEcOHX8StvQ5CSsuJuhlHtIgYPmzAHb0OQkrLCdtwZIuI4SuOLpVDFNNUhHm8oEXE8OH4ykuEaYrCy1tEDB/+TF4iTFMUXtciYvhwsk6HIKVlpxbxlhYRw6e8o9sxSOkehFNaRAwf3tXrEKR0j+KdLSKGD+/JQYppWrIUp7WIGD68O/dA0jSFU1tEDB9O63UIUrpH8Y4WEcOHt+c9kDQtsZS3tYgYPpzU6xiktNywiDe1iBg+6k97HYOUlp9FvLZFxPDh5fkLK01LWMSxLSKGr3hhMd/rIKS0nDCP57eIGD48s8q2XgchpWXFbfi1FhHDhyfj5m4HIaVl5fvKE1tEDB8ejev6HIOUlheuwSNbRAwfHohLeh2ElJYTvoH9WkQMH/bC53odhJSWEz5T7NkiYvgYrMDHex2ElJYTPmow2K1FxGjgxJzImyY/i/iLFhE/kndBUvrpUdvzDkjEiBVHVB7lTRMe9QNVT2oRMTo4AJf1Ogwp7UzUf1EPaRExOliDQa/DkNLOhI1Y3SJitHBaDlVME5talA9JRYwHXlhs73YgUtphcgM9YlxwSKnr+xyHlHYcrsXBLSJGD2txfq8DkdKOwmexV4uI8cCpvQ5ESjsKp7SIGB/qOVS+DZImK24vNrSIGB+sw9ZuhyKluwlb8HMtIsYHu+Mfex2KlH5CH8fKFhHjhd9XeZw3TUx3lnpRi4jxwyNwRadjkdKPhcuxrkXE+GEVzup1MFK6a/gU9mgR0Qe8hnwfJPUdFvHqFhH9wOORt9JT1+FaPLZFRD+wqvI0Vuo8/MMgf19F9Kf4LeSlwtRluA3PbRHRH+yLL/Y6IGm2w+fxMy0i+oTji4VeRyTNZtQ8jmsR0S+sw6W9Dkmazaj/zNElERMAJ+WR3tRNahFvbhHRP6zHVd0OSpqpcCUe0yKifwaD3XBa5SokjTmW8vYBcy0iJgPW55j3NO6wJVcfERMIb8hVSBpX1AJe1yJi8hQHFv/R68Ck6Q7/jgNaREwmHJdvhaRRhzvxshYRk0t5CL7a69Ck6QxfwYNbREw2vLSqckZWGk3cXry4RcTkq7IPzlK5oZ6Gm6X4FNa2iJgOeCKu7HV40nSErTi0RcR0wQm4s9fxSZMd7sArWkRMH9wXZ+p0gNIEZylnYJ8WEdMJh+evrLTLU1tLPaFFxHTDsbi92zFKExVuw0tbREw/7IkP55iTdG/DIj6ENS0iZgPW4eJehyn1n6W4IB+KiphB+FV8p9eBSn2H6/D0FhGzx6B2wyuV23odqdRn+F8cV4NBvvMRMauo+6h6T1Ut9DpWqbOYx2lY3SJitlXV/XFG6XSwUj+xiH8q9m0REUvwMHyh2+FKXYTPFetaRMRd4efx9V7HK403fBWPbxERdwdPzvdD0o+lFvEVPKlFROwIfgGXdTtoaaThW3hii4jYGVU2VPl2r6OWRhOuwpEtImJn1ea/nyuOwtW9jlsayY/Hs1pExHINzjlnDkfiihwBP1vhcjyjRUTcG/gVXFL5JO5spL6JX24REbsCnoQLS95Yn9awgC/i8BYRsSvhQHy8Sn5Epi21gI/hgBYRMQzYD+/Htm7HMC0r3I6/wQNaRMQwYS+8Djf2Oopp58INeC32bBERo4CVxW8Ul/Y6jmnH4RIchRUtImLU8Diche29DmX68bAdZ+KQFhExTtgXJ+IHvY5m+v9U3YQ34n4tIqIH2B3PxQWY73VAZzY1jy8oz1a1skVE9AYPwsn4Xl487CN8FyfhgS0iomeDgZV4OqrUnb0O6/TnTsDTkKuOiJgc2Bcn4HJyNTKqsIjLcHzlXkdETKrBwBwei4/hll5Hd1rCLfgI1pdNcy0iYtL9H3v3zlsDGMYB/LQS93tiwCoxo8LAhgEDCSESdmHvIgx08wk60U0sbtVzfv+hJezE5QOUoUtbNai04kgTA5M0Gk7b55f8v8L75s37XLAGJ9EMX2u67wKHaQzhOFY3SillqUlswgWMiOmOPZAXQcyFLxgO57GpUUopSx224gTu43NVbM0j0k4yhXs4ji2NUkpZbrAORzGAsY49tDsnY5E7SY5gbaOUUpY7rMRe9OEtmal/kp+RmfAm3Ap7kqxslFJK+V2rpRs7cQmDSSayDEuA0cZ4eBIuYkdauhullFL+LKxLchA3wsswtZT7SZiLT3iB6zhQY9ZLKeUvaOoKm3EY1zEixln8mxHJd4xjGNdwCJsftqqHo5RSFlSaurAR+3FVDOA5PoaZTr0o5oJ2YgYf8Ax3cQU92NAcbNWlUUop/4pYgQ3YjdOhD4/D+zARZv/LHwptzGI8vMMj3BKnsBvra5FTKaV0EC1dZFXYHnpwFr3oB8lrySgmw3T4hjbm84r4dTHTNCYxileAfvTiDPaF7Vj19MFQvTBKKWWx0Wp2Y02SbZJd6AnHcA6X0Ru5idv4wd79xtpR13kcnwKF8qclsKL4APAPqAgqwoo+ghATTBBQVxIekKgJCCJEfWIiQYQ12UXDQkQUiS5IFHdZQCwCvef3GgINgoSAQYQGERECAQyCoGmhLW3vdpYr3LOnl/a298/MOZ9X8o7BVpTe+Z2vM3NmfpfgMvxoostwCf4D36w1v9cXcCKOxj/jndgLO6vzbamIiJH1nz//yYLrb7xxwXUbu2rZzTlziIiIiIiIiIiIiIiIiIiIiIiIiIiI2HZ6y7YrZWwhZZFSdiulLCnF7qXeGE1LKP9XoenVXytNZUnzn6Esav4eesvy3EdExDDo9XrbYVfsjYNwJE7AF/ENfAdX4josw224A3ep67vQ9GvcMdGv9f/aHbgNy3AdrsR38A18ESfgSByEvbFrr9fLkImIaJPCjngLDsUJOAuX4xaswDNYiVcwrq5fq56hTI6mV7ASz2AFbsHlOAsn4FC8pZCNoSIi5sJ/X3/dAuyMd+JYfB3X4nd4Dq+0eb+QScPlOfwO1+LrOBbvxM4b/xnz1HtExEwoyvbYGx/FObgZj6mtxhafHdRNmgz8Gk39v1dfm/v9E7Gxvt+7ZUOlthqP4Wacg49i76Lkbb0REdNRStm+Zh+cgMtwP1aqbfmwmMikamZ/gExxmWxLh4raOFbiflyGE2r2KSXDJCJiqhvfC7AXjsNleAhrsNlhoa8pft+ctvlhZgv+96FpDR7CZTgOe/V62a0wIqLCTjgU5+IevFTXg0ND318b1zTp17T0vseWDT/jda3/n3Ug43gJ9+BcHIqdqoiIUYM98SlcrfZnpnt5qr03y6efaZ0xoenPuBqfwp5VRMQwW3bzsgXYB2fgDrw0MDg6elYxW9n8Ja6XcAfOwD4b/4xzeSsihkevV7bDATgbD2DdFB+Wnb0sNStN737JOjyAs3FAr1fy4GJEdBfLJgaH8/BIzYYp721kYEzRNP+82IBHcB4OqI1lkEREd/RuuH4B9sVZeJi6b3BoytDYtjZzZkK9AQ/jLOy78WeSS1sR0W7YE6fht1jf96GnHieXp2auwedTav2/hvX4LU7LzfaIaCWl7IRjUGPtwFdQm9TjZHjMRppMpP+BySasRY1jlJKv/0bE/Lult2wBDsRleHHT/+9YUwbHHKTJ1H/eeBGX4cBbevnGVkTME8oSnIaH1QY/yPJtqnlp80/nG8fDOI2ypIqImCvGxhbUfBDXYvVrH075Gm5rB0m9qUHCalxb80FjYzkbiYjZpZRdcRoeHfxAamrnB2na9M9HE4/iNKXsWkVEzAbsjyvxcp4c72ZT/ZzwMq7E/lVExEzB9jgGv6lrGRxD0KZ/bsbxGxyDvD4+IrYNFuOrePa1D5rcIB+KpvoZ4ll8FYuriIitQdkXV2BNvl01nE3188QaXEHZt4qImA4chuXkktUoNMWZSNNyHFZFRGyOsbHtcCweauuHXZrb8BCONZYXM0bEFCgLcTKeaeuHWZqf8AxOpiysIiImU8ou+Br+9voHh1yyGtFM1LdbIn/D15pjpYqIaJRSluBbg893GDdUW8emaTSwV3sTXsa3SskrUCJGHmUPfA9rc6M8bckNdqzF97BHFRGjifJP+BHW5fmONK3nRViHH1H+qYqI0YI34Yq+TZ8YJ69dT4OpB/cZwXpcgTdVETEasCcuV08eHk02lnseaYoMHh9q63F5djuMGAGU3fGDgctWzQDJm3TT1t0TWYcfUHavImI4YVdciFfydHma4afWX8GFyCvhI4ZNKWUnnIvVbf1gSt0Oq3FuyZ7rEcOjlLI9zsTKnHWkWb6ctRJnllLyOviIYYAT8VwuW6U5upz1HE6sIqLbcGTN4xkcaU4HCY/jyCoiugkH4t6ceaR5OhO5FwdWEdEteDNukOc60jyFphvw5ioiuqGUsggX1bX1OetI83s2Yj0uao7JKiLa7b+u+p8FOBWrXlvQeatumrMGjzeswqnNsVlFRHvhCDzx+uJtMl5ngKQ5yzhNk4YKT+CIKiLaCfvg9smLmY3lFSVpDtrccYfbsU8VEe1SlEX4fl6GmFob4/h+kfshEa2Cz2FVbpqnNt9Uxyp8roqIdsAh+EM2hUptHR4m/3v8AYdUETG/lLI7rm3rB0hKmwrXKnn9e8S8wpeyn3lqe1Psq/6lKiLmBw7DYxkeqQsZHCKP4bAqIuYWFuOamgyP1Jn6jlPGcQ0WVxExd3BKNodKXQ+rcUoVEXMD78aKXLpKXczgpawVeHcVEbOLshCXIK9oT53M4ABpuoSysIqI2YOj8fxrC9LG8qqS1LX0H7d4HkdXETE7avbAmLoezwBJnU7/cauJsZo9qoiYefh8zZrWfiiktC2xBp+vImJmYT/cl/seaZgyeD/kPuxXRcTMuPjf/20BzlHnxnkarkzUtxkV52w85rP5VMRMwEF4NMMjDWMDQ4RHcVAVEdumN9bbHheq5U27aSgzkf6zkAubY7+KiK2Hw/BUzj7SMGfwLOSpvCcrYhuUXtkBl75+9mFc9jZPQ5raeN+xzqXNGqgiYvpwOJ6p6zoDJA19///4xjM4vIqI6VFePfvIpas0Shm8lHWpkrOQiGnBYXg6AySNUgYHyNO5FxIxDb1ebztcRO59pNFr8vGOpouaNVFFxObhvXg89z7SKGbwXsjjeG8VEZuHc8nASKkJTedWEfHGsC8ezL2PNMoZvBfyIPatImJqOB3rM0DSKGdwgKzH6VVEbJpS9sDyti7qlOYzLFdK9guJ2BQch1X/2HBHNopKI57+AbIKx1UR0a+U3kL8xMRikQGSUt+lLE38pJRe9k6PmAwfwFNtXcgptSE8hQ9UEfE6nJ2v7qb0xqHp7CoiXoW9cHdbF21KLftG1t3Yq4qIqsLxeKluFki+tpvS5gbISzi+ihh1E3t+XJ7nPlKa1hC5PHuFxMjD/tnvPKWt2jd9/ypilOFkrGvrwk2pjWEdTq4iRhVlEX7e1kWaUpvDzymLqohRhIPxVC5dpTT9S1l4CgdXEaMIZ2BDBkhKW3MvxAacUUWMmqIswtK2LtSUuhCWllzGilGDg3L5KqUZuYx1UBUxSnBqLl+ltM0DZANOrSJGBRbi6mYB5OnzlKbT4FrB1cgbemM04O34Y1sXaEpdCn/E26uIUYBPY01bF2RKXQpr8OkqYtj9678ctwAXq+XSVUozkNo4Lm7WVhUxzLDn5Fe3kyGS0lZl4BXve1YRwwwfwV/7FkG2rk1pehkYIH/FR6qIYYYzs/NgSjMbms6sIoZV6fV2wFW5/5HSzKT/PshVpdfLHiExnPBWPJi9P1KalT1CHsRbq4hhhCPx9zw8mNLMP1SIv+PIKmIY4Su5/5HS7ISmr1QRw0YpO+CnOetIaXbSxE+V7JUeQwZ74b62Lr6UhiHch72qiGGCD+H53DxPaVbfzvs8PlRFDBN8Buv/8RCUPDyY0oxk0nrCenymihgmuBCvHuQZICnN1gBpurCKGBZK2QUlz3+kNCfPg5RmzVURwwD74ZEMkJTmZIA8gv2qiGGAI0w8QKi2sTwLktLM1b+u8HccUUUMA5wyaf/zDJCUZji1/n3SOaWKGAa4CLl8ldLcfJW36aIqouuUsgg31XWdb2ClNCsNrivc1Ky9KqLLsDceyAZSKc3pBlMPYO8qostwCJ7N5auU5vTNvM/ikCqiy3Ac1mSApDSn90HW4Lgqosvw5dxAT2lebqR/uYroMlzc1gWX0jCHi6uIrqrZsWZpdiBMadYbXGMsrdmxiugi7Il78gqTlGY/gwPknpo9q4guwjvweFsXXErDHB7HO6qILsKH8UJbF1hKwxxewIeriC6q+UTNmrYusJSGOs3a84kqoovwhWwildL83AdRG8cXqoguwjczQFKa12dBvllFdM3SpUsX4IdtXWgpjUL4YbMWq4guKaW3I5a+fjAbr7MPSEqz2OA6w9JSenkWJLoFS3DHawdyBkhKc1D/jp+4A0uqiC7B3liRhwhTmte38q7Ia92jc7A/nshrTFKav/AE9q8iugSH4rmcfaQ0r9/Eeg6HVhFdgqOwMgMkpXkdICtxVBXRJfgE1maApDSvA2QteRo9OgafxYYMkJTmdYBswGeriC7BmeRruynNZ2g6s4roEpytzla2KbXgfVhnVxFdgvOzF3pKrXgf1vlVRJfgkjoDJKX53ZmQcVxSRXTFjb+8YQGuyFPoKc3/1ra4YuOazAsVoxuU3vb4WVsXWErDnMEB8rNmTVYRXUBZiOtz9pHS/A8RXE9ZWEV0QSllEZZlgKTUigGyrFmTVUQXlFJ2QZ17ICm14hJW3azJKqILKLvi1ubglQGS0hw2uOZwK2XXKqILanarWZ4BktL8n4HULK/ZrYroAiymvr2tCyylUYr6diyuIrqgZgnuzBlISq24hHVnnW1toytqdsddGSAptWKA3FWzexXRBTJAUmrVAJEBEl2BJbizrQsspVEKd8olrOgKLMav2rqgUhql8KvcRI/OwG5Y3tYFldIoheXyNd7oCuyKW9u6oFIapXAr8iBhdMPEq0xuaeuCSmmUwi15lUl0BmVnlLwHK6VWvEyxUHauIrqAshNuag5emtq5yFIa1iavO9xE2amK6AIsxHV1czBneKQ0P5n4V66rsx9IdIVeb3tc1dqFldIIhav0siNhdMRNv7xxAS5v64JKaZTC5RvXZPZEj+7Ad3MTPaVW3ET/bhXRJTgfGSApzfeeIJxfRXQJzkZrF1hKoxCazq4iugSnZ4Ck1IoBcnoV0SU4EetyHySleb3/sQ4nVhFdgo/h5QyQlOZ1gLyMj1URXYLD69oLbV1kKY1GXsDhVUSX4AA82c5FldJohCdxQBXRJUV5M+6vmwM5l7BSmrP0D5D7m7VYRXRJKWUn/MLEAU09Xsu7sVKatbyapnoiflFKXqQYHYTz0HeAq/9RvuKb0rambpr0wK6Br/CeV0V0ET6OVVMf9HlSPaWtSV+aBn8Pq/DxKqKLsBjXbNlCkEGS0nTPON4gXIPFVURX4X1Y8cYLwzivVufSVkrbvE6wAu+rIroOx+NJm9tBbWJhaP46395KI55J/6pvgGzmDIUncXwVMQyMjW2Ho3E3NkzvSdqmDJM0Gk1x3G/RsY8NuBtH172x7aqIYYL9cAH+wnS+mti/kMgwScPT5GPawHG/+WjyF1yA/aqIYUVZiKNws9qarfrmif4FR963lbrRpo5Ztv4YVluDm3GU7HseowJ74Ez8Htv4wriJ8uLG1NJMavqXpwZD0+9xJvaoIkZNr4wtwHtwAR7F+m1fqBkkqaWDYyb+fqzHo7gA7+mVsex1HqOt9MoOeBfOwI14GuuxzYu2bsqZSprTM4uJZmB4oGk9nsaNOAPvatZMFRH9lLIL3o/TcDX+hLVm4PkQJqoHk7OXNEW2NE0z8d9nHGvxJ1yN0/D+Zm1UEbFllLIT9sdJ+DEexura7H3XXv/LH/sHSp5PGcpMfSwMvpxwto4B9ThW42H8GCdhf3kRYsS20+stxNvwyZpv4zY8jVdmZe/1KQdIf3XOXjqRiab385y9N0ij6RU8jdtqvo1P4m16vXybKmK23KIswBIcjJPwfdyLFzE3H0Zb/A0bE+n/62ncaB2lbYE1beEQmPrlnCa1mftfc/jniqYXcS8uxUk4GEtuUXIz/H/bu2PQKNIoDuAXcxJyeCYE0ojbCoLYpVMM9mJho2ChVeqovSJYnAgnKIiFaOQKFTwlujvzfgvKqfHQxkqI6SxECxU0Fioabsfb4hZXEhG8xLwf/CGQ3dk3O8O8nW9250vp/6AsekUMYzMO4DKm8Rpz+L4HwgU2EAtoIL6UeX9b0OV1fLaMr29O8w3v6HKTTLrWOP86zt9ALKiBfP95aFBlDq8xjcs4gM3EcLXP/pRSWnwiog81bMEYjqOBh3iuPezF4vyk3ZGvPLh2/0TejnbmHcbRNea7PqCd7gf2zjoXvH7tLNIzMzqGo57jIRo4jjFsQS0ndUppiSoaRU9E9BNrMIKdOISLuI/HmMVHlu9t5TsPxv6bZTWM1i06v1I7i8e4j4s4hJ0YIdZERH/RyN9npPTDOvfb7z1RFitFDGEdRrEHhzGBG3iEF3i/nBvLcguqvMcLPMINTOAw9mAU60QMVftQa1/KZpFS+lcUjd6IWCWihhHswH6cwBVMYRrP8AYf2reiz6l6F3G0z6ZQ5QPe4BmmMdXkCk5gP3ZgRERNxKoo8ppFSukblIoeoo8YxFpsxFbswjiOYgIF7mEGT/EK7zBHe0KgnIHx29M5T0Y75vAOr/AUM7iHAhM4inHswlZsxFpikOiLaOTZRErp+7t66Y+eRr3RG2X0E0OoYQM2YTv2Yh+O4BQuocRtPMAMnuAlZvFW+7pMZ368sxx0y0e8xSxe4glm8AC3UeISTuEI9mEvtmMTNqBGDFXbpNo2rW2UDSKltLTVr0/2lEWxUkQ/VmMYNazHCEaxDbsxhnEcxDGcxGmcwVmca+c8LmAScBO3cIfmlGbz7mehHX/rzF381U7X/1fpvszmFO7gFm4CJnEB59Gu11mcwWmcxDEcxDjGsBvbMIoRrEcNw1gtor96D1vvZTaFlFJaiD/r53smr17uKRr1FfVrkyuuT06uKK7Ve6PeSlH+HGXZV5blL1GWq5oRq4mBCAM0B7slymjFoKgSgxFaiUFl+WuV6u8qPkX12E/P+eLywgAxUL22Vg1VLa30VbVVNVa1VjVXtVfrUK1La52yCaSUUkoppZRSSimllFJKKaWUUkopLVX/AJKhZGATtVrWAAAAAElFTkSuQmCC"
                : profilePicture.Trim(),
            IsAdmin = isAdmin,
        };
    }

    public User AddCredits(decimal credits)
    {
        Credits += credits;

        return this;
    }

    public User PromoteToAdmin()
    {
        if (IsAdmin)
        {
            throw new InvalidOperationException("User is already an admin.");
        }

        IsAdmin = true;

        return this;
    }

    public User DemoteFromAdmin()
    {
        if (!IsAdmin)
        {
            throw new InvalidOperationException("Cannot demote a user who is not an admin.");
        }

        IsAdmin = false;

        return this;
    }

    public User SubtractCredits(decimal credits)
    {
        Credits -= credits;

        return this;
    }

    public User UpdateEmail(string email)
    {
        Email = (email ?? string.Empty).ToLowerInvariant();

        return this;
    }

    public User UpdatePassword(string password)
    {
        using var scope = ServiceLocator.Instance.CreateScope();
        var cryptographyService = scope.ServiceProvider.GetRequiredService<ICryptographyService>();

        Password = cryptographyService.HashPassword(
            string.IsNullOrWhiteSpace(password)
                ? string.Empty
                : password.Trim());

        return this;
    }

    public User UpdateProfilePicture(string profilePicture)
    {
        ProfilePicture = $"data:image/png;base64,{profilePicture}";

        return this;
    }
}