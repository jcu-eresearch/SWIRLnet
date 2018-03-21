import json
import sys
 
configDir="/srv/SWIRLnet/config/"

def main():
    with open(configDir+"config.json", encoding='UTF-8') as configFile:
        text = configFile.read()
        config = json.loads(text)
        val = config["updateNewCyclone"]
        print(val)
        if val :
            sys.exit(1)
        else :
            sys.exit(1)
        
main()        
