import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;

  ngOnInit(): void {
    this.train();
  }

  async train() {
    // Define a model for linear regression
    this.linearModel = tf.sequential();
    this.linearModel.add(tf.layers.dense({
      units: 1, inputShape: [1]
    }));

    // Prepare the model for training
    // Specify the loss function and the optimizer
    this.linearModel.compile({
      loss: 'meanSquaredError', optimizer: 'sgd'
    });

    // Training data, completely random stuff
    const xs = tf.tensor1d([3.2, 4.4, 5.5]);
    const ys = tf.tensor1d([1.6, 2.7, 3.5]);

    // Train
    await this.linearModel.fit(xs, ys);

    console.log('Model has been trained!');
  }

  predict(val) {
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0];
  }

}
