# Highchart Lambda Export Server

This repo was created in response to [this](https://stackoverflow.com/questions/57097890/highcharts-export-server-on-aws-lamdba/57158024) question on stackoverflow.

## In a hurry?

Deploying a highcharts export server on AWS Lambda turned out to be **WAY** more difficult than anticipated due to the lack of available information and the large amount of trial and error. So hopefully this will help save you days of pain!

If you are in a hurry you you can just download and use the prebuilt zip in the `dist` folder. It should work straight out of the box as a lambda deployment. You will need a Lambda function running `Node.js 10.x`.  As chart generation is resource intensive, for best performance you should use at least 4096MB of RAM.  Anything less than this can lead to timeouts.  Higher values may improve performance further.


Make sure you set the `FONTCONFIG_PATH` Lambda Environment variable to `/var/task/lib`.

[![FONTCONFIG_PATH][1]][1]

The function expects a JSON representation of the chart options. For example:

```json
{
  "chart": {
    "style": {
      "fontFamily": "Arial"
    },
    "type": "bar"
  },
  "title": {
    "text": "Historic World Population by Region"
  },
  "subtitle": {
    "text": "Source: Wikipedia.org"
  },
  "xAxis": {
    "categories": [
      "Africa",
      "America",
      "Asia",
      "Europe",
      "Oceania"
    ],
    "title": {
      "text": null
    }
  },
  "yAxis": {
    "min": 0,
    "title": {
      "text": "Population (millions)",
      "align": "high"
    },
    "labels": {
      "overflow": "justify"
    }
  },
  "tooltip": {
    "valueSuffix": " millions"
  },
  "plotOptions": {
    "bar": {
      "dataLabels": {
        "enabled": true
      }
    }
  },
  "exporting": {
    "chartOptions": {
      "chart": {
        "events": {
          "load": {}
        }
      },
      "style": {
        "fontFamily": "Arial"
      }
    }
  },
  "legend": {
    "enabled": false
  },
  "credits": {
    "enabled": false
  },
  "series": [
    {
      "name": "Year 1800",
      "data": [
        107,
        31,
        635,
        203,
        2
      ]
    },
    {
      "name": "Year 1900",
      "data": [
        133,
        156,
        947,
        408,
        6
      ]
    },
    {
      "name": "Year 2008",
      "data": [
        973,
        914,
        4054,
        732,
        34
      ]
    }
  ]
}
```

And it will return a Base64 encoded PNG of the chart in a `data` object.

```json
{
  "data": "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broBexNP0eVu7+vv6ALS09Np1KiRs8uoEBqra9JYXZPG6pqq0lih9OPVWoQuyNV/0bONy84uQUREpERVaqmcRaffdHYJYoFJ9Wc5uwQREZESVamAJa7PMAyio6NJTk7Gy8uL3r174+XlVeQjM/Llrx2pdSFFRMQqCljiMjIzMxk4cCA7duww2zw9PVmzZo35uIyiREREAGhdSBERsYzmYInLCA0NJTExkdq1a5tt1atXZ8SIEYX27d+/P6mpqbi5udGhQwetCykiIpZSwBKXsWHDBiZMmIDNZmPy5MkADBkyhLNnz7JhwwYMwyAlJYWWLVsyZ84cevbsyaJFi+jVq5fWhRQREUspYInLqF27NmlpaXh5eREbGwtgPuj12LFjAEyZMoUpU6Ywfvx4WrRoQUhICFDympEiIiJlpTlY4jIGDRpkPhH/yJEjALi7X/0V9/b2Zv/+/cTExDBgwAC2b99uXrUqac1IrQspIiI3QlewxCXk5ubSuHHjQu2HDh2iTp069OnThzVr1tC3b19WrVqFn58fAQEBQMlrRmpdSBERuREKWOIS3N3d+eijjwq1R0VFsWLFCurVq0d0dDS///47e/bsITAw0NynpDUjtS6kiIjciCp1i1APqHQN2cZlathqFmrfsGEDISEh7Nmzh9q1a9OvXz9ee+012rRpA0BycjJ79+4FwM/PzzyupDUjtS6kiIjciCoVsKoKV18XqqhwBdC+fXu2bdtW7HFZWVlFtru5uTF69GhGjx5tRXkiIiK6RSgiIiJiNQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELKaAJSIiImIxBSwRERERiylgiYiIiFhMAUtERETEYgpYIiIiIhZTwBIRERGxmAKWiIiIiMUUsEREREQspoAlIiIiYjEFLBERERGLKWCJiIiIWEwBS0RERMRiClgiIiIiFlPAEhEREbGYApaIiIiIxapswLqcY3d2CSIiIuKi3J1dQEWasTnT/Hl2fy8nViIiIiKurEoFrLLIysoiJiaGjIwM2rRpQ48ePRy2R0dHEx8fT2BgIJ06dXJSlSIiInIrUsAqwr59++jcubND2yOPPMJXX33FO++8w6FDh1i+fDkXL14kIiJCAUtEREQcKGAVITQ01OF1UFAQUVFRbNq0ialTpwLQvHlz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roiIVGH6FqFUGu7u7kVOTo+KiuKjjz6iXr16JR6/ceNGNm7cCFxdwin/ZxEREatVqYBV2odXivNlG5epYatZqH3Dhg2EhISwZ88eateuTb9+/Xjttddo06ZNif0VnJdls9nMcBUREUFoaKi1xYuISJVXpQJWVeEK60IVFa4A2rdvz7Zt2657fElLbFaR5TdFRMSJNAdLKrX09HRnlyAiIlKIApaIiIiIxRSwRERERCymgCUiIiJiMQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELKaAJSIiImIxBSwRERERiylgiYiIiFhMAUtERETEYgpYIiIiIhZTwBIRERGxmAKWiIiIiMUUsEREREQspoAlIiIiYjEFLBERERGLKWCJiIiIWEwBS0RERMRiClguqFGjRjd1/OUcu0WViIiIVE3uzi6gIs3YnOnsEiqF2f29nF2CiIhIpValApZYw263Exsby4EDB2jatCn9+/fHZrMBkJWVRUxMDBkZGbRp04YePXqQkZHBmjVrCvUTGBhIp06dKrp8ERGRcqeAJWUSHR3N2LFjOXTokNk2atQoli9fzr59++jcubPD/o888ggTJkwgLCysUF8REREKWCIi4pI0B0tK7ZtvvmHAgAHk5eU5tH/44Yfs2LGD0NBQh/agoCC2bt3KZ599Ro0aNfD396/IckVERJxGAUtK7c033+Sxxx7D3b3whc/t27eze/duh7b8QJWWlkanTp1ISUkxt3l5eXHfffeVb8EiIiJOooAlpbZv3z46derEwYMHzbbevXsD8PDDD3Pp0iWH/WfOnImHhwdnzpzBbrdz7tw5c1uXLl0YOHAgJ06cqJjiRUREKpAClpTJ5cuXsdlsTJ48GYB+/foBMG/ePBYuXOiwr91uZ/To0fz444/s3r2b+fPnExcXB0CfPn3IzMzkiy++qNgBiIiIVABNcpdS69ixI5s2bcLHx4fY2FgAjh49CsAXX3zB2rVrAWjdujWBgYG8//775ObmYhgGdevW5eOPP+aXX34BICEhAQAfHx8njERERKR8KWBJqU2dOpVhw4YBmLf2lixZQkBAAN27d+fjjz/m+PHjJCUlkZSUBMCyZcuoX78+gwcP5oMPPmDPnj0ArFy5khYtWvDHP/7ROYMREREpR1UqYOkBmqVzOcdOTY/Cd4+HDh3K2rVrmTNnDgcOHMDT05OgoCD++te/Uq9ePdq1a8eyZctITk4mKysLX19fBg0axLRp0/D19aV+/fqsWbOGzMxMunfvzpIlS6hRo4YTRigiIlK+bIZhGM4uoiLsTTxFl7u9nV1GhUhPT7/p5XIqC43VNWmsrkljdU1VaaxQ+vFqkrsLcsVf9PPnzzu7BBERkVKrUrcIe/f+k7NLkBsUHf2ls0sQEREptSoVsMT1uLm5YRgG0dHRJCcn4+XlRe/evfHycpxvl52dzZIlS8jLyyMwMJCYmJhi+9QaiSIicrMqPGBlZGQwY8YM3n77bby9i58TFRwcTGRkZAVWJpWR3W7noYceYseOHWabp6cna9asYeDAgWbbhAkT+OCDD4CrayAWtTZiPq2RKCIiN6vC52AlJCTQvHlzEhMTS9xP4UpKY/r06SQmJlK7dm2zrXr16owYMYKsrCzg6u9STEwMH330UbH99O/fn9TUVNzc3OjQoUO51y0iIq6twgNWfHw8AwcO5OeffzbboqOjmTx5MpMmTWLr1q3A1StY27ZtY8qUKYSEhLBu3bqKLlUqgQ0bNjBhwgSHp8sPGTKEs2fPsnXrVnbt2sWOHTto1qwZJ0+eNI8zDAPDMEhJSaFly5bMmTOHnj17smjRInr16uWs4YiIiIuo0ICVm5vL2bNnueeeezh69Cj5T4jYtGkTU6dOZerUqWzcuNHc/7PPPiM0NJTp06fzzTffVGSpUknUrl2btLQ0vLy8zKfL+/r6AvDLL78QFBREv379HOZcxcTEsG/fPgCmTJnClClTGD9+PC1atCAkJKTiByEiIi6nQudgJSUl4efnh81mw8fHh7S0NJo0aUKHDh2Iioqia9euhIeHm/uHh4ezb98+EhISqCKP65IyGjRoEO+//z4AR44cAcDd/eqv9cqVK6lbty4jR44kLy/PPGbjxo0EBgZSrVo1YmJiGDBgANu3b2f37t0VPwAREXFJFXoFKz4+nm3bthEcHEx8fLw5D2v06NEMHTqUo0ePsmjRInP/iIgILly4wODBgyuyTKkkcnNzady4caH2Q4cOUadOHQ4cOECrVq2YN28eERERBAYGEhERYe63Zs0a+vbty6pVq/Dz8yMgIKAiyxcRERdWoQErISGB2bNnExkZycSJE815WJMmTQKgZ8+epKenm/sfPXqU9u3bmwsKF5xDI+Lu7l7kxPWoqChWrFgBXL1aFRYWRlhYGLNmzXL49mB0dDS///47e/bsITAwsMLqFhER11dhtwgzMzPJzc3Fx8cHgFatWrF06VLy8vIYMmQI8+fPB3C4WtWzZ09mz55N165dadmyJQsWLGDOnDk3XIMeVll5nT9/Hk9Pz0Lt69atIywsjD179lC7dm369evHa6+9Rps2bRxuK9tsNnN+X0REBKGhofzXf/0Xe/fuBcDPz69iBiIiIlWC1iIUERERy2Ubl6lhq+nsMixX2rUIq9ST3BedftPZJUi5sVHDVoNsIxuoEv/PICJyS5tUf5azS3CqKhWwxJUZZBuXnV2EiIiUwbXLmF27ioZhGMTExJCYmMgdd9xBnz598Pb2JiMjgzVr1hTq79o+rtd/eVLAEhEREae4dhmzggHo0qVL9OvXj2+//dZs8/T0JCoqikuXLhW55Nm1fZTUf3mr8Ce5i4iIiFxvGbP58+cTGxuLzWYz2+rWrcuYMWNISEigRo0a+Pv733D/5U0BS0RERCpUccuYFbR27VqCgoJo1KgRzz33HADDhg0jNTWV7777jk6dOpGSkmLu7+XlxX333Vfq/subApaIiIhUmIyMjOsuYwZXHxrdsWNHTp48Sfv27QFo0qQJAMnJydjtds6dO2fu36VLFwYOHEhCQkKp+i9vClgiIiJSYZ544olilzErGIjq1KnDuXPnqF69OhcvXgTgypUrwNUHj+/evZv58+cTFxcHQJ8+fcjMzGTYsGGl6r+8KWCJiIhIhYmJiSlxGbN8HTp04PPPP6dFixasW7cOwAxTsbGx+Pr68vHHH/Puu+8CV1eLAfjll19K1X9507cIRUREpEJt3LjRXF1j8ODB5s8FvfHGG4WWMVu/fj3Dhg2jRo0aDBs2jHfffZc9e/YAsHLlSlq0aMGhQ4dK1X9505PcRURExHKleZJ7wW8I5i9jVlBUVBSzZ882n4M1dOhQ5s2bR506dcjOzuaNN95gzZo1ZGZm0r17d5YsWeKw9Nn1+r8RpX2SuwKWCyrtyXcFGqtr0lhdk8bqmqrSWKH049UcLBERERGLKWCJiIiIWEwBS0RERMRiClgiIiIiFlPAEhEREbGYApaIiIiIxRSwRERERCymgCUiIiJiMQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELKaAJSIiImIxBSwRERERiylgiYiIiFhMAUtERETEYgpYIiIiIhZTwBIRERGxmAKWiIiIiMUUsEREREQspoAlIiIiYjEFLItczrE7uwQRERG5Rbg7u4CKNGNzZrn1Pbu/V7n1LSIiIpVLlQpYznTp0iU2b97M6dOnufvuu+nevTsAhmEQExNDYmIid9xxB3369MHb29s8Lisri5iYGDIyMmjTpg09evRw1hBERESklBSwKkB6ejpdu3bl2LFjZlv//v1Zu3YtAwYM4NtvvzXbPT09iYqKom/fvuzbt4/OnTs79PXII4/w1VdfUb169QqrX0RERMpGc7AqwKxZsxzC1d13383mzZsZP348sbGx2Gw2c1vdunUZM2YMly5dIjQ01KGfoKAgtm7dyqZNmyqsdhERESk7BawK8OWXXwLwwgsvAPD6668DsHXrVoKCgmjUqBHPPfccAMOGDSM1NZUdO3awe/duh378/f0ByM3NrajSRURE5AYoYFWA3377DYD//Oc/RERE0K1bN3x8fPj999/p2LEjJ0+epH379gA0adIEgIMHD3Lp0iWHfmbOnImHhwdt27at2AGIiIhImWgOVgU4cOAAy5YtY9y4cdhsNv7+978TGxtLz549OXfuHNWrV+fixYsAXLlyBYDY2FjOnz/v0I/dbmfs2LE89NBD7Ny50wxlIiIicmvRFaxytnfvXkaOHMmbb77JunXrGDNmDO3bt+frr7+mefPmfP7557Ro0YJ169YBEBcXB8Cnn35KWFgYAK1bt2bMmDHk5eWRm5vLhQsX2LVrl9PGJCIiIiXTFaxyNmXKFOrWrUv9+vXNq1PR0dEAhISE8M9//tNh//Xr1zNs2DCaN2/O6tWrOX78OElJSSQlJQGwbNkyGjRowMCBAyt2ICIiIlJqVSpglefDQC/n2KnpUfiC4J49e7hw4UKRx7Rs2ZL169cze/Zs8zlYQ4cOZd68edSuXZu2bduybNkykpOTycrKwtfXl0GDBjFt2jR8fHzKbSwiIiJyc6pUwCpPRYUroNA8qqIEBQUV2T569GhGjx59U3WJiIhIxdMcrEqiNEFNREREbg1V6gpW795/cnYJNyw6+stS76unvIuIiDiXJQErODjY4XVkZKQV3UoZZWdns2TJEvLy8ggMDKRTp07XXevw+PHjfPfdd2RlZXHPPfdw3333OXEEIiIirsGyK1hWharc3Fyys7OpXbu2Jf1VJRMmTOCDDz4AICIigrZt29KvX79i1zqMiori8ccfd+jjscceY8OGDbi7V6mLmyIiIpYqtzlYBa9q5f8cHBzMp59+SkhICNOmTWPatGkkJyeb+4WEhPC3v/2NV199le+++46UlBSmT59OWFgYe/fuLa9SXUJkZCQxMTF89NFHZtv8+fNLXOtw0qRJDn38+c9/5osvvmDDhg0VVreIiIgrsixgBQcHm39KUq9ePXx9fXnqqacYPnw4n3zyibktJyeH0aNHM3nyZP73f/+XdevWMW7cOKZPn87GjRutKtXl7Nq1ix07dtCsWTNOnjxptq9du7bEtQ4NwwDg4YcfBuD+++8HcAhkIiIiUnaWBazIyEjzT0kCAwM5fvw49957Lx07diQtLc3cVqNGDXx9fWnatCmnTp0iLS2NuXPn8tZbb3Hq1CmrSnUpGRkZBAUF0a9fP2JiYsz2mJgYUlJSil3rMCUlhQceeACAbdu2AbB8+XJq1qxpLiotIiIiN6bCJ9q4uRWf6ex2O4ZhkJeXh4eHBzk5OSxevJhq1apVYIWVyxNPPEHdunUZOXIkeXl5ZvvGjRupU6dOsWsdrl69mrNnz3LHHXdw5swZbDYb77//Pv/3f//H/fffz/fff0+LFi2cMiYREZHKrtzmYLm5uZGenk5CQkKhbb6+viQkJBAXF8edd95ptufk5LB//34SEhJo1qwZvr6+xMfHk5qayowZM8qr1EotJiaGVq1aMW/ePCIiIggMDCQiIgKAO++8s9i1Dn/44Qf8/f2x2+088sgjGIbBwYMHGThwIJmZmWzZssVpYxIREansLLuCVXDuVWRkJD169ODtt9+mS5cuNG3a1GHfoKAgVqxYAcCoUaMctu3cuZOkpCRefvllzp8/z8qVK3Fzc+Ppp5+2qlSXs3HjRnOO2uDBg82f+/TpU+xah7fffjvLly8HYOvWrQB8+eWXhIaGUrduXfr27VuBIxAREXExxi1k7Nix5db3ngMny63vinDu3Lnr7gOYfyIiIgzDMIz169cb9957r+Hh4WE0aNDACA4ONs6ePWtcuXLFmDt3rtGxY0ejVq1ahru7u3HnnXcaTz31lJGYmFjew7HMsWPHnF1ChdFYXZPG6po0VtdV2vHqYUeVhKen53X3Mf7/bwUWFBQUVOxah9OnT2f69Ok3VVe2cZkatpo31YeIiIiruaUCVnk/AX7R6TfLtf9bWXVbDXKMKxgUDmE1bLXIMbKxYy9zv5Pqz7KiPBEREZdySwUsKT9XjOxit2Ublyx/v4ULFxa7LX8Zn6ysLGJiYsjIyKBNmzb06NHD3OfSpUts3ryZ06dPc/fdd9O9e3fLaxQRESkvClhSLsLCwordlv8tx86dOzu0P/LII3z11VdkZmbStWtXjh07Zm7r378/n3/+uR7ZISIilUK5PaZBpKD+/fuTmpqKm5sbHTp0IDQ01GF7UFAQW7duZdOmTcyaNcshXN19991s3ryZL7/8sqLLFhERuSEKWFIuDMPAMAxSUlJo2bIlc+bMoWfPnixatIhevXqxe/duh/3znx6fm5trBqkXXngBgNdffx3AYRkgERGRW5kClpSrKVOmMGXKFMaPH0+LFi0ICQkBrs6xKmjmzJl4eHjQtm1bfvvtNwD+85//EBERQbdu3fDx8eGxxx6r8PpFRERuhOZgSbnZv38/MTExDBgwgO3bt5tXrYqaAG+32xk7diwPPfQQn332Gd9++y3jxo3DZrPx97//ndjYWBo0aFDRQxAREbkhClhSbtasWUPfvn1ZtWoVfn5+BAQEAFevVp05cwaA1q1bExgYyPvvv09ubi4XLlzg5Zdf5qeffuKf//wn0dHRDBs2jK+//poLFy5oIWoREakUFLCk3ERHR+Pt7c2ePXsYPny42f7iiy+yevVqjh8/TlJSEklJSQAsW7YMDw8P7rrrLurXr28uTB0dHQ1c/fahApaIiFQGVSpg6aGY1ivpSe7Jycns3bsXAD8/P7M9PDyctm3bsmzZMpKTk8nKysLX15dBgwaxfPlyYmJiKqR2ERGR8lKlAlZVkZ6eTqNGjSrkvUpaJicrK6vIdjc3N0aPHs3o0aMLbbt2cWoREZHKSN8iFBEREbGYApaIiIiIxRSwRERERCymgCUiIiJiMQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELKaAJSIiImIxBSwRERERiylgiYiIiFhMAUtERETEYgpYIiIiIhZTwBIRERGxmAKWiIiIiMUUsEREREQspoAlIiIiYjEFLBERERGLKWCJiIiIWEwBS0RERMRiClgiIiIiFlPAEhEREbGYApaIiIiIxRSwRERERCymgCUiIiJiMQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELFalAtavv6Y4uwQRERGpAqpUwPrDH1o6uwQRERGpAtydXcCtxG63Exsby4EDB2jatCn9+/fHZrM5uywRERGpZMocsC5evMjixYs5dOgQfn5+TJgwgVq1alleWHBwMJGRkZb3W5zo6GjGjh3LoUOHzLZRo0axfPnyCqtBREREXEOZbxF++umnNGvWjPDwcO666y42btxYHnVVaLj65ptvGDBgAHl5eQ7tH374ITt27KiwOkRERMQ1lPkKVnx8PNOnT6d27dr06tWL+fPnc/DgQSIjI7l8+TLDhw/nwQcfJCUlhcjISHJychgxYgRdunRh27ZtbNq0iezsbHr27MkTTzwBQEhICF26dGHv3r306NGD4cOHExwczFNPPVXk/lZ78803eeyxx/jxxx8Lbdu+fTsPPPBAubyviIiIuKYyX8E6d+4cdevWBaBu3bpkZWWxdu1aHn/8caZOnUpUVBQA69atY9y4cUyfPt28yvXZZ58RGhrK9OnT+eabb8w+c3JyCAgI4NVXX+Xbb78124vb32r79u2jU6dOHDx40Gzr3bs3AA8//HC5va+IiIi4Jku+RZiWloa/vz9NmzZlwYIFZtvcuXN56623OHXqFADh4eGkp6ezZcsWDMNw6KN9+/Y0btyY3Nxcs62k/a12+fJlbDYbkydPBqBfv37A1fAlIiIiUhZlDlh16tQhKysLgKysLOrWrYvNZivy23aLFy8mMjKS9957D4CIiAguXLjA4MGDS/VeZd3/RnXs2JFNmzbh4+NDbGwsAEePHgWgQYMG5freIiIi4nrKHLDatWvHli1buHDhAlu2bKFdu3Y0bNiQuLg4UlNTmTZtGgC+vr7Ex8eTmprKjBkzgKuhpX379mZ4OXnyZInvVdb9b9TUqVPZv38/J06cYPfu3QAsWbKEgIAA+vfvXy7vKSIiIq6rzAFr2LBhHDp0iOnTp3PkyBGGDBnC0KFDWbduHYsWLTInog8ePJjVq1fz7rvv8vjjjwPQs2dPZs+eTVxcHC1btjRvJxanrPtfT3FPch86dChr167F39+f6tWrU79+fZ599lm+/PJLPDw8buo9RUREpOqxGeU9uekWsTfxFF3u9nZ2GRUiPT2dRo0aObuMCqGxuiaN1TVprK6pKo0VSj/eKrVUTkHZxmVnlyAiIiIuqkotlbPo9Jvmz5Pqz3JiJSIiIuLKqlTAKousrCxiYmLIyMigTZs29OjRw2F7dnY2S5YsIS8vj8DAQDp16uSkSkVERORWo4BVhH379tG5c2eHtkceeYSvvvqK6tWrAzBhwgQ++OAD4OrjJBSwREREJF+VnYNVktDQUIfXQUFBbN26lU2bNgFX10mMiYnho48+ckZ5IiIicotTwCpC/rOw8vn7+wOQm5vLrl272LFjB82aNSu353KJiIhI5aaAVYRLly45vJ45cyYeHh74+PgQFBREv379iImJMbfHxMRoSR0RERExaQ7WNRYuXFiozW63M3bsWPr06UOLFi0YOXIkeXl55vaNGzdqoruIiIiYFLCuMXPmTM6cOQNA69atCQwM5P333yc3N5e8vDzq1KnDvHnzAAgMDCQiIoKwsDBnliwiIiK3GAWsa7z44ousXr2a48ePk5SURFJSEgDLli0Drn7DMP924ODBg9m4caPTahUREZFbU5UKWAUfLpptXKaGrWahfcLDw2nbti3Lli0jOTmZrKwsfH19GTRoENOmTaNZs2YA2Gw2M1xFREQU+uahiIiIVF1VKmAVVFS4AnBzc2P06NGMHj26xOOryBKOIiIicgP0LUIRERERiylgiYiIiFhMAUtERETEYgpYIiIiIhZTwBIRERGxmAKWiIiIiMUUsEREREQspoAlIiIiYjEFLBERERGLKWCJiIiIWEwBS0RERMRiNkOL6omIiIhYSlewRERERCymgCUiIiJiMQUsEREREYspYImIiIhYTAFLRERExGIKWCIiIiIWU8ASERERsZgCloiIiIjFFLBERERELKaAJSIiImIxd2cXUBGOHDlCZGQkubm5vPTSSzRr1szZJVli69at/M///I/5OjIyssixVtbx5+Tk8OOPP7J06VIiIyPN9tKOsTKNu7ixuuo5PnjwIMuWLePixYs888wzdO3a1SXPKxQ9Vlc9rzt37uSTTz4BYNCgQXTv3t1lz2tRY3XV8woQFxfH4sWLzf8+Vcbzeu0Yyvt8VYmAtWHDBgYNGkReXh6fffYZEydOdHZJlvj999957bXXHE52UWOtrOMPCQkpsr20Y6xM4y5urK56jtevX8+QIUO47bbbWLly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"
}
```


## Building from scratch:

A fairly significant proportion of the packages needed for this need to be compiled specifically for the OS so the only way I found to achieve this universally was by using docker with an AWS image that matches the one used by Lambda.

```bash
// Launch the docker with amazon linux
docker run -it --rm amazonlinux:2.0.20190508

// Install wget
yum install wget

// Install nodejs
curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
yum -y install nodejs

// Install required dependencies
yum install -y bzip2 tar
yum install -y yum-utils rpmdevtools
cd /tmp
yumdownloader fontconfig.x86_64 freetype.x86_64 expat.x86_64
rpmdev-extract *.rpm

// Create the project and folders called lib and fonts inside it
mkdir -p /highchart_export_server/lib
mkdir -p /highchart_export_server/fonts

// Copy the installed dependencies to the lib folder
cp /tmp/*/usr/lib64/* /highchart_export_server/lib

// Download the ttf fonts and unzip the fonts into the fonts dir
wget https://github.com/tarkal/highchart-lambda-export-server/raw/master/resources/fonts.zip
unzip -j fonts.zip -d /highchart_export_server/fonts/

// Download the updated fonts.conf file and place it in the libs
wget https://raw.githubusercontent.com/tarkal/highchart-lambda-export-server/master/src/lib/fonts.conf -P /highchart_export_server/lib

// Init the project and install highcharts-export-server
cd /highchart_export_server
npm install highcharts-export-server

// For some reason the install shows some warnings that can be fixed by an audit
// To run an audit the system needs a package.json created with the init
npm init
npm audit fix

// Download the basic index.js
wget https://raw.githubusercontent.com/tarkal/highchart-lambda-export-server/master/src/index.js

// Zip everything up into a deployment package
// The -y and -r options are needed to include all files and embed sim links
// You must not include the parent directory
zip -y -r highcharts-export-server.zip .
```

Now you need to copy the zip file from the docker container onto your host machine. Open a new terminal window and type the following:

```bash
// Show all the docker containers
docker ps

// This will show you some info including the container ID that you need
 
// Copy the file to the host
docker cp <container_id_returned_from_docker_ps>:/highchart_export_server/highcharts-export-server.zip highcharts-export-server.zip
```

So at this point you end up with a zip file containing the following;

```
- fonts (folder containing desired fonts)
- lib (folder containing font config bins and the fonts.conf pointing to the fonts folder)
- node_modules (folder containing everything for node and high charts)
- index.js (file containing execution code)
- package-lock.json
- package.json
```

This is the same package as provided in the zip and project. The important parts to note about the `index.js` that I discovered by trial and error are;

1. You MUST run everything inside a `Promise`. Otherwise the highcharts server will return an `undefined` `res` in the export function and you will end up with an error every time.
2. You need to include the `{maxWorkers: 2}` in the init. For some unknown reason it fails on lambda without it (likely a resource issue).
3. Lambda functions cannot return files directly. So if you are going to convert your chart to a PDF or SVG you will need to create some code to handle writing the file that is created by highcharts to a byte[] (or some other mechanism like S3) 


## Run using API Gateway to Lambda:

If you plan to use API Gateway, the options will need to be passed in through the body of the request. The dist folder includes a version that creates the exportSettings from the body of the request, so you will need to pass along the options in the JSON object.

Example request:
```
{
"b64":true, 
"options":{
  "chart": {
    "style": {
      "fontFamily": "Arial"
    },
    "type": "bar"
  },
  "title": {
    "text": "Historic World Population by Region"
  },
  "subtitle": {
    "text": "Source: Wikipedia.org"
  },

    ...

}
```

If you need to alter the index file, follow the following steps. This is similar to the the manual building process in that it uses docker.


```bash
// Launch the docker with amazon linux
docker run -it --rm amazonlinux:2.0.20190508

// Install wget
yum install wget


yum install -y bzip2 tar
cd /tmp


// Download the dist
wget https://raw.githubusercontent.com/tarkal/highchart-lambda-export-server/master/dist/highcharts-export-server.zip


//unzip folder if you need to make changes to the index file
unzip  highcharts-export-server.zip


//move up zip file
mv highcharts-export-server.zip ../

// edit index.js
vi index.js

// change index file as needed
// ise i to enter INSERT mode and Esc to exit INSERT mode
// if you are using API gateway cance event to event.body 
// you may also need to parse the body if it is a string using JSON.parse(event.body)
// use :wq to save and exit vi

// Zip everything up into a deployment package
// The -y and -r options are needed to include all files and embed sim links
// You must not include the parent directory
zip -y -r highcharts-export-server.zip .


// change permissions to zip file
chmod 775 highcharts-export-server.zip

```

Then follow the same process to copy the zip file to your host machine.

```bash
// Show all the docker containers
docker ps

// This will show you some info including the container ID that you need
 
// Copy the file to the host
docker cp <container_id_returned_from_docker_ps>:/highchart_export_server/highcharts-export-server.zip highcharts-export-server.zip
```



I hope this helps.

> **JS Experts** If someone wants to submit some code for a better `index.js` feel free. 

> **Highcharts Team**: Feel free to use this in your docs and/or link to it to help your users.


  [1]: https://i.stack.imgur.com/KVf4o.jpg
  [2]: https://i.stack.imgur.com/U0AMl.jpg
