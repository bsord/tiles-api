'use strict';

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { Resource } = require('@opentelemetry/resources');
const { B3Propagator } = require('@opentelemetry/propagator-b3');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { MongooseInstrumentation } = require('opentelemetry-instrumentation-mongoose');


const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "tiles-api",
  })
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
        host: process.env.TRACING_HOST
      // If you are running your tracing backend on another host,
      // you can point to it using the `url` parameter of the
      // exporter config.
    })
  )
);

provider.register({
    propagator: new B3Propagator(),
  });

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new MongooseInstrumentation(),
  ],
});

console.log("tracing initialized");