import { GestureDescription, Finger, FingerCurl } from 'fingerpose';

const One = new GestureDescription('one');
const Two = new GestureDescription('two');
const Three = new GestureDescription('three');
const Four = new GestureDescription('four');
// Define finger positions for each gesture

// One finger (index finger up)
One.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    One.addCurl(finger, FingerCurl.FullCurl, 1.0);
    One.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Two fingers (index and middle up)
for (let finger of [Finger.Index, Finger.Middle]) {
    Two.addCurl(finger, FingerCurl.NoCurl, 1.0);
}
for (let finger of [Finger.Ring, Finger.Pinky]) {
    Two.addCurl(finger, FingerCurl.FullCurl, 1.0);
    Two.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Three fingers (index, middle, and ring up)
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
    Three.addCurl(finger, FingerCurl.NoCurl, 1.0);
}
Three.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
Three.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

// Four fingers (all except thumb up)
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    Four.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

export {
    One, Two, Three, Four
}