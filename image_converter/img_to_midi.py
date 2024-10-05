from PIL import Image
import numpy as np
from mido import Message, MidiFile, MidiTrack

def pixel_to_midi_note(s):
    return int(44 + (s * 48 / (3*255)))

def image_to_pixel_array(image_path):
    img = Image.open(image_path)
    img = img.convert('RGB')
    img = img.resize((32,32))
    return np.asarray(img)

def pixel_array_to_midi(pixels, output_path):
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    for x in range(pixels.shape[0]):
        for y in range(pixels.shape[1]):
            r, g, b = pixels[x,y]
            if (r+g+b > 100):
                note = pixel_to_midi_note(r+b+g)
                track.append(Message('note_on', note=note, velocity=16, time=20))
    mid.save(output_path)

pixel_array_to_midi(image_to_pixel_array("image2.png"), "output.mid")
