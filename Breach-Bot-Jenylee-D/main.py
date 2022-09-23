#Breach Bot Starter Code
breachYear = 2019

#Greets user
print("Hello! I'm Breach Bot.")
userName = input("What is your name?\n")
print("Nice to meet you " + userName)

#Recounts year of Breach
todaysYear = input("What year is it?\n")
timePassed = int(todaysYear) - breachYear
print("Wow! That means it has been " + str(timePassed) + " years since the Facebook Data Breach.")


#Introduces breach
print("Would you like to learn about the Facebook Data 2019 Breach?")
giveInfo = input("Type 'yes' or 'no'\n")

#Explains breach
while giveInfo.lower() == "yes":
  print("What would you like to learn more about? Enter the lowercase letter of the following options: \n(a) breach details, (b) organization's response, or (c) I would like to hear your reflection")
  topic = input()
  
  if topic.lower() == "a":
    print("Outsiders stole the personal information of 533 million Facebook users by exploiting a vulnerability in a Facebook feature that allowed users to find each other by phone number. The hackers exposed the phone numbers, full names, locations, and email addresses of those impacted onto a hacking forum.")
  
  elif topic.lower() == "b":
    print("Facebook fixed the issue in August 2019, however had no plans at the time to notify the impacted users individually because they were unsure which users would be notified.")
  
  elif topic.lower() == "c":
    break
  
  else:
    print("Sorry, I didn't catch that. Choose one of the options listed.")
  
  input("Press enter to continue\n")

#Introduces my take
print("\nI'm excited to share my perspective with you. Are you ready to hear my take?")
giveInfo = input("Type 'yes' or 'no'\n")

#Shares my take
while giveInfo.lower() == "yes":
  print("What would you like to learn more about? Enter the lowercase letter of the following options: \n(a) relation to the CIA Triad, (b) my reaction, (c) my advice, or (d) none")
  topic = input()
  
  if topic.lower() == "a":
    print("This data breach connects to confidentiality because the hackers gained access to users’ personal information by exploiting Facebook’s features. Additionally, hackers had access to sensitive information, which they then posted on a hacking forum.")
  
  elif topic.lower() == "b":
    print("Though Facebook swiftly fixed the issue, it failed to notify specific users that hackers had taken their information. I disagree with Facebook’s response, as Facebook should have let the impacted users know and provided the following steps on how to proceed.")
  
  elif topic.lower() == "c":
    print("I would convince victims to take action by informing them of the dangers of having their personal information stolen, which includes identity theft, fraud, and much more. Afterward, I would advise them to changing the passwords to be stronger and enabling two-factor authentication. Lastly, to supervise any system that may be using their information.")

  elif topic.lower() == "d":
    break
  
  else:
    print("Sorry, I didn't catch that. Choose one of the options listed.")
  
  input("Press enter to continue\n")
  
#Chatbot ends conversation
print("Thanks for chatting with me, and I hope you learned something new!")