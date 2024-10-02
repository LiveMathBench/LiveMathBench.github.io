import React from "react"
import styles from "./Leaderboard.module.css"
import { exec } from "child_process"

function mean(array: Array<number>) {
  return array.reduce((a, b) => a + b, 0) / array.length
}

function formatNumber(number: number) {
  return Number(number.toFixed(1))
}

function get_pass_at_1(
  results_df: Array<any>,
  model: string,
  start: number,
  end: number
) {
  // model and date filter
  const results = results_df.filter(
    (result) =>
      result["model"] === model &&
      result["date"] >= start &&
      result["date"] <= end
  )

  const average_pass = formatNumber(
    mean(results.map((result) => result["pass@1"]))
  )
  const mid_pass = formatNumber(
    mean(
      results
        .filter((result) => result["difficulty"] === "Middle School")
        .map((result) => result["pass@1"])
    )
  )
  const high_pass = formatNumber(
    mean(
      results
        .filter((result) => result["difficulty"] === "High School")
        .map((result) => result["pass@1"])
    )
  )
  const col_pass = formatNumber(
    mean(
      results
        .filter((result) => result["difficulty"] === "College")
        .map((result) => result["pass@1"])
    )
  )
  const hso_pass = formatNumber(
    mean(
      results
        .filter((result) => result["difficulty"] === "High School Olympics")
        .map((result) => result["pass@1"])
    )
  )
  const others_pass = formatNumber(
    mean(
      results
        .filter((result) => result["difficulty"] === "Others")
        .map((result) => result["pass@1"])
    )
  )

  return {
    average_pass,
    mid_pass,
    high_pass,
    col_pass,
    hso_pass,
    others_pass
  }
}


function getLeaderboard(
  performances: Array<any>,
  models: Array<any>,
  start: number,
  end: number
) {
  return models
    .filter((model) => model.release_date)
    .map((model) => {
      const { average_pass, mid_pass, high_pass, col_pass, hso_pass, others_pass} = get_pass_at_1(
        performances,
        model.model_repr,
        start,
        end
      )

      let output = {
        Model: model.model_repr,
        "Estimated Cutoff For LiveCodeBench":
          "Estimated Cutoff For LiveCodeBench: " + new Date(model.release_date).toLocaleDateString(),
        Contaminated: model.release_date >= start,
        "Avg": average_pass.toString() === "NaN" ? -1 : average_pass,
        "Mid": mid_pass.toString() === "NaN" ? -1 : mid_pass,
        "High": high_pass.toString() === "NaN" ? -1 : high_pass,
        "College": col_pass.toString() === "NaN" ? -1 : col_pass,
        "Olympiads": hso_pass.toString() === "NaN" ? -1 : hso_pass,
        "Others": others_pass.toString() === "NaN" ? -1 : others_pass,
      }
      return output

    })
    .sort((a, b) => b["Avg"] - a["Avg"])
    .reduce(
      (
        acc: {
          results: Array<typeof model & { Rank: number | null }>
          rank: number
        },
        model
      ) => {
        let rank = null
        if (!model.Contaminated) {
          rank = acc.rank
          acc.rank += 1
        }
        acc.results.push({
          Rank: rank,
          ...model,
        })
        return acc
      },
      { results: [], rank: 1 }
    ).results
}

function getDateMarksFromModels(models: Array<any>) {
  const modelDates = models
    .filter((model) => model.release_date)
    .map((model) => model.release_date)

  const uniqueDates = [
    // @ts-ignore
    ...new Set(modelDates),
    new Date("2024-01-01").getTime(),
  ]

  return uniqueDates
    .map((date) => ({
      value: date,
      label: new Date(date).toLocaleDateString(undefined, {
        timeZone: "UTC",
      }),
    }))
    .sort((a, b) => a.value - b.value)
}

function getDateMarksFromTimestamps(timestamps: Array<number>) {
  return timestamps.map((timestamp) => ({
    value: timestamp,
    label: new Date(timestamp).toLocaleDateString(undefined, {
      timeZone: "UTC",
    }),
  }))
}

function getColumnDefs(columnNames: Array<string>, modelsDict: any) {
  // Format the columns into array of { field: "column_name" }
  return columnNames
    .map((column_name) => {
      switch (column_name) {
        case "Rank":
          return {
            field: column_name,
            suppressMovable: true,
            cellClass: 'suppress-movable-col',
            width: 80,
            minWidth: 50,
            maxWidth: 100
          }

        case "Model":
          return {
            field: column_name,
            suppressMovable: true,
            cellClass: 'suppress-movable-col',
            flex: 2,
            // tooltipField: "Estimated Cutoff For LiveCodeBench",
            minWidth: 150,
            maxWidth: 250,
            // cellRenderer: (params: any) => {
            //   return modelsDict[params.value].link ? (
            //     <a
            //       href={modelsDict[params.value].link}
            //       target="_blank"
            //       className={styles.leaderboardModelLink}
            //     >
            //       {params.value}
            //     </a>
            //   ) : (
            //     params.value
            //   )
            // },
          }

        case "Estimated Cutoff For LiveCodeBench":
          return null

        case "Contaminated":
          return null

        case "Avg":
          return {
            field: column_name,
            headerTooltip: "Avg is the average accuracy on all problems.",
            sort: "desc",
            width: 100,
            minWidth: 70,
            maxWidth: 120
          }

        case "Mid":
          return {
            field: column_name,
            headerTooltip: "Average accuracy on problems with Middle School difficulty",
            width: 100,
            minWidth: 70,
            maxWidth: 120
          }

        case "High":
          return {
            field: column_name,
            headerTooltip: "Average accuracy on problems with High School difficulty",
            width: 100,
            minWidth: 70,
            maxWidth: 120
          }

        case "College":
          return {
            field: column_name,
            headerTooltip: "Average accuracy on problems with College difficulty",
            width: 100,
            minWidth: 70,
            maxWidth: 120
          }

        case "Olympiads":
          return {
            field: column_name,
            headerTooltip: "Average accuracy on problems with High-School-Olympiads difficulty",
            width: 100,
            minWidth: 70,
            maxWidth: 140
          }

        case "Others":
          return {
            field: column_name,
            headerTooltip: "Average accuracy on problems with Others difficulty",
            width: 100,
            minWidth: 70,
            maxWidth: 120
          }

        default:
          return {
            field: column_name,
          }
      }
    })
    .filter((columnDef) => columnDef !== null)
}


export { getDateMarksFromTimestamps, getLeaderboard, getColumnDefs }
