Page({
  build() {
    let isPlaying = false;
    let bpm = 88;
    let currentTimer = null;
    let screenTimer = null;

    // Create vibrate sensor
    const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);

    // Function to keep screen alive
    function keepScreenOn() {
      hmSetting.setBrightScreen(1);
      hmSetting.setScreenAutoBright(false);
      hmApp.setScreenKeep(true);
    }

    // BPM display
    const bpmText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 100,
      w: 194,
      h: 40,
      text: `${bpm}`,
      text_size: 36,
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H,
    });

    // Minus button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 27,
      y: 150,
      w: 45,
      h: 45,
      text: "-",
      text_size: 30,
      normal_color: 0x333333,
      press_color: 0x666666,
      click_func: () => {
        if (bpm > 40) {
          bpm -= 1;
          bpmText.setProperty(hmUI.prop.TEXT, `${bpm}`);
        }
      },
    });

    // Plus button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 122,
      y: 150,
      w: 45,
      h: 45,
      text: "+",
      text_size: 30,
      normal_color: 0x333333,
      press_color: 0x666666,
      click_func: () => {
        if (bpm < 208) {
          bpm += 1;
          bpmText.setProperty(hmUI.prop.TEXT, `${bpm}`);
        }
      },
    });

    // Play/Stop button
    const playButton = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 47,
      y: 220,
      w: 100,
      h: 50,
      text: "START",
      text_size: 24,
      normal_color: 0x005500,
      press_color: 0x007700,
      click_func: () => {
        if (!isPlaying) {
          isPlaying = true;

          // Initial screen keep
          keepScreenOn();

          // Set up screen refresh timer
          screenTimer = timer.createTimer(
            5000, // Refresh every 5 seconds
            5000,
            () => {
              if (isPlaying) {
                keepScreenOn();
              }
            },
            {}
          );

          const interval = Math.floor(60000 / bpm);

          const tick = function (option) {
            if (!isPlaying) {
              timer.stopTimer(currentTimer);
              return;
            }

            // Keep screen on each tick too
            keepScreenOn();

            vibrate.stop();
            vibrate.scene = 23;
            vibrate.start();
          };

          currentTimer = timer.createTimer(1, interval, tick, {});

          playButton.setProperty(hmUI.prop.TEXT, "STOP");
          playButton.setProperty(hmUI.prop.NORMAL_COLOR, 0x550000);
          playButton.setProperty(hmUI.prop.PRESS_COLOR, 0x770000);
        } else {
          isPlaying = false;

          if (currentTimer) {
            timer.stopTimer(currentTimer);
          }
          if (screenTimer) {
            timer.stopTimer(screenTimer);
          }

          hmApp.setScreenKeep(false);
          hmSetting.setScreenAutoBright(true);
          vibrate.stop();

          playButton.setProperty(hmUI.prop.TEXT, "START");
          playButton.setProperty(hmUI.prop.NORMAL_COLOR, 0x005500);
          playButton.setProperty(hmUI.prop.PRESS_COLOR, 0x007700);
        }
      },
    });
  },

  onDestroy() {
    hmApp.setScreenKeep(false);
    hmSetting.setScreenAutoBright(true);
    vibrate && vibrate.stop();
  },
});
