from gtts.tts import gTTS
import subprocess
#import pyglet
import os
import sys

class TSpeech:

    def say(self, messageText, lang='zh-cn'):
        if messageText=='':
            messageText='No message to play'

        tts = gTTS(text=messageText, lang='en')
        tts.save("Message.mp3")
        os.system("mpg123 Message.mp3") #mpg321

        return 1


def main():
    tts=TSpeech()
    for arg in sys.argv[1:]:
        tts.say(arg)

if __name__ == "__main__":
    main()
    



