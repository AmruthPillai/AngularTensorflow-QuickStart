import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawableDirective } from './drawable.directive';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;

  model: tf.Model;
  predictions: any;

  @ViewChild(DrawableDirective) canvas;

  ngOnInit(): void {
    this.train();
    this.loadModel();
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

  predictLinear(val) {
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0];
  }

  /// LOAD PRETRAINED KERAS MODEL
  async loadModel() {
    this.model = await tf.loadModel('/assets/model.json');
  }

  async predict(imageData: ImageData) {
    // We run our predictions inside of tf.tidy to clean up the intermediate memory allocated to the tensors.
    // Basically, we are just trying to avoid memory leaks.
    const prediction = await tf.tidy(() => {
      // Convert the canvas pixels to a Tensor of the matching shape
      let image = tf.fromPixels(imageData, 1);
      image = image.reshape([1, 28, 28, 1]);
      image = tf.cast(image, 'float32');

      // Makee and format the predictions
      const output = this.model.predict(image) as any;

      // Save predictions on the component
      this.predictions = Array.from(output.dataSync());
    });
  }

}
