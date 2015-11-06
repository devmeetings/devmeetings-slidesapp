colors <- function(type, withAlpha=FALSE) {
  if (length(type) > 1)
    sapply(type, FUN=colors)
  else {
    intVal = as.integer(type)
    if (is.factor(type))
      intVal = as.integer(paste(type))
    a = ifelse(withAlpha, 30, 255)
    switch(intVal,
           {rgb(red=209, green=242, blue=165, alpha=a, maxColorValue = 255)},
           {rgb(red=239, green=250, blue=180, alpha=a, maxColorValue = 255)},
           {rgb(red=255, green=196, blue=140, alpha=a, maxColorValue = 255)},
           {rgb(red=34, green=34, blue=34, alpha=a, maxColorValue = 255)},
           {rgb(red=255, green=159, blue=128, alpha=a, maxColorValue = 255)},
           {rgb(red=245, green=105, blue=145, alpha=a, maxColorValue = 255)},
           {rgb(red=106, green=74, blue=60, alpha=a, maxColorValue = 255)}
    )
  }
}

printf <- function(...) {
  print(sprintf(...))
}

newWindow <- function() {
  Sys.info()['sysname'] -> sys
  if (sys == "Linux")
    x11()
  else
    windows()
}

converTime <- function(t) {
  as.POSIXct(strptime(t, '%Y-%m-%d %H:%M'))
}

generateTestReport <- function(plotTime, plotName, measuredLatency, plotDescription) {
  # Split into 3 groups - avg latency (75%), high < 20000 and very high
  latencyThr <- 400
  veryHighLatencyThr <- 20000
  veryHighLatency <- subset(measuredLatency, latency > veryHighLatencyThr)
  highLatency <- subset(measuredLatency, latencyThr < latency & latency <= veryHighLatencyThr)
  avgLatency <- subset(measuredLatency, latency <= latencyThr)
  
  measuredLatencySample <- measuredLatency[sample(length(measuredLatency$clientId), 3000) ,]
  
  plot(
    measuredLatencySample[,c('clientId', 'latency', 'date')],
    col=colors(3 - as.numeric(measuredLatencySample$latency < 500), withAlpha=TRUE),
    pch=19,
    main=paste(plotName, ':', plotDescription)
    )
  
  # Generate charts
  maxVal = 1e4
  
  measuredLatencySubset <- subset(measuredLatency, plotTime[1] < date & date <= plotTime[2])
  #newWindow()
  layout(matrix(c(1,1,2,3), 2, 2, byrow = TRUE))
  ### Pie chart
  pieData <- c(
    length(subset(veryHighLatency, plotTime[1] < date & date <= plotTime[2])$latency) / length(measuredLatencySubset$latency) * 100,
    length(subset(highLatency, plotTime[1] < date & date <= plotTime[2])$latency) / length(measuredLatencySubset$latency) * 100,
    length(subset(avgLatency, plotTime[1] < date & date <= plotTime[2])$latency) / length(measuredLatencySubset$latency) * 100
  )
  pie(
    pieData,
    labels = paste(
      c('Very High', 'High', 'Average'),
      '\n',
      round(pieData,2),
      '%'
    ),
    col=colors(c(5, 3, 1))
  )
  title(paste('Latency Distribution', '\n', plotName))
  # Summaries
  boxplot(summary(subset(avgLatency, plotTime[1] < date & date <= plotTime[2])$latency), col=colors(1), log="y")
  title(paste('Average Latency Summary', '\n', plotName))
  boxplot(summary(measuredLatencySubset$latency), col=colors(1), log="y")
  title(paste('Measured Latency Summary', '\n', plotName))
  
  #############
  par(mfrow=c(1, 2))
  plot(latency ~ date, avgLatency, col=colors(1, TRUE), pch=1, xlim=plotTime, ylim=c(100, maxVal), log='y', xaxt='n')
  axis.POSIXct(1, at = seq(plotTime[1], plotTime[2], by ="min"), format = "%H:%M")
  par(new=T)
  plot(latency ~ date, highLatency, col=colors(3, TRUE), pch=17, axes=F, xlim=plotTime, ylim=c(100, maxVal), log='y')
  par(new=T)
  plot(latency ~ date, veryHighLatency, col=colors(5, TRUE), pch=17, axes=F, xlim=plotTime, ylim=c(100, maxVal), log='y')
  par(new=F)
  title(paste('Latency in Time', '\n', plotName))
  
  plot(latency ~ date, measuredLatency, col=measuredLatency$clientId*70, xlim=plotTime, ylim=c(100, maxVal), log='y', xaxt='n')
  axis.POSIXct(1, at = seq(plotTime[1], plotTime[2], by ="min"), format = "%H:%M")
  title(paste('Latency ~ ClientId', '\n', plotName))
  
  #coplot(latency ~ clientId | date, avgLatency, pch=19, col=measuredLatency$clientId*50)
  #coplot(latency ~ clientId | date, avgLatency, pch=19, col=colors(3))
}

##########################################33-----------------------------------------


# Reda data
data <- read.csv(file="./data/latencies.csv", head=TRUE, sep=",")
# Take only part
latencyData <- subset(data, event == 'latency')
latencyData$date = as.POSIXct(latencyData$date / 1000, origin="1970-01-01")

part <- data[sample(length(data$clientId), 200000),]
# Fix dates
part$date = as.POSIXct(part$date / 1000, origin="1970-01-01")

# Get only latency data
#measuredLatency <- subset(part, event == 'latency')
measuredLatency <- latencyData[sample(length(latencyData$clientId), 70000), ]
testLog <- subset(part, event != 'latency')

#rename
measuredLatency$latency <- measuredLatency$data
# Display Summary
summary(measuredLatency$latency)

# Split into 3 groups - avg latency (75%), high < 20000 and very high
latencyThr <- 400
veryHighLatencyThr <- 20000
veryHighLatency <- subset(measuredLatency, latency > veryHighLatencyThr)
highLatency <- subset(measuredLatency, latencyThr < latency & latency <= veryHighLatencyThr)
avgLatency <- subset(measuredLatency, latency <= latencyThr)

# Display groups share
printf('Very high: %f%%', length(veryHighLatency$latency) / length(measuredLatency$latency) * 100)
printf('High: %f%%', length(highLatency$latency) / length(measuredLatency$latency) * 100)
printf('AVG: %f%%', length(avgLatency$latency) / length(measuredLatency$latency) * 100)

summary(veryHighLatency$latency)
summary(highLatency$latency)
summary(avgLatency$latency)

test1.Lim <-  converTime(c('2015-09-21 19:55', '2015-09-21 20:40'))
test2.Lim <-  converTime(c('2015-09-21 20:40', '2015-09-21 21:00'))
test3.Lim <-  converTime(c('2015-09-21 21:00', '2015-09-21 21:30'))
test4.Lim <-  converTime(c('2015-09-21 21:30', '2015-09-21 22:00'))
test5.Lim <-  converTime(c('2015-09-21 22:00', '2015-09-21 22:24'))
test6.Lim <-  converTime(c('2015-09-21 22:24', '2015-09-21 22:40'))
test7.Lim <-  converTime(c('2015-09-21 22:40', '2015-09-21 23:10'))
totalTime <-  c(min(measuredLatency$date), max(measuredLatency$date))

pdf(file='report.pdf')
plotTime <- test1.Lim
plotName <- 'Test plot'
plotDescription <- 'Test BASDFASDF'
generateTestReport(test1.Lim, 'Test 1', measuredLatency, 'LTE; Dwa pretesty; 20:30 - Niska moc na jednym')
generateTestReport(test2.Lim, 'Test 2', measuredLatency, 'LTE; Ubiquity na niskiej mocy')
generateTestReport(test3.Lim, 'Test 3', measuredLatency, '2M/2M; 21:08-youtube; 21:10-embed z gandalfem')
generateTestReport(test4.Lim, 'Test 4', measuredLatency, 'LTE < 3M/2M; 21:40-youtube')
generateTestReport(test5.Lim, 'Test 5', measuredLatency, '6M/6M; 22:06-youtube')
generateTestReport(test6.Lim, 'Test 6', measuredLatency, '4M/0.5M')
generateTestReport(test7.Lim, 'Test 7', measuredLatency, 'NUC; 22:43 - inet4M/4M; 22:49 - inet2M/2M; 22:57 - 15 kompów')
dev.off()

