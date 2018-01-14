---
title: Principles of Mobile User Interfaces
lang: en
keys: ux, mobile, hci, interaction
date: 2018-01-14
---

# Principles of Mobile User Interfaces

Last year was the first time that mobile users topped desktop users on a worldwide scale. If we take a look at the [global statistics](https://www.w3counter.com/globalstats.php) the leading screen resolution today is 640x360 with over 22%.

This shouldn’t be ignored and while responsive and mobile first development have been around for some time now, interaction in a mobile interface is very different to one in a desktop interface. With the rise of React Native and [Progressive Web Apps](https://github.com/TalAter/awesome-progressive-web-apps) developing mobile user interfaces will also be a big part of Web Development in the coming years.

When developing mobile user interfaces, simplicity is essential for a good user experience. The interface should be consistent, avoid cognitive overload and disorientation in the user.

In order to satisfy and measure users interactions, 5 measurable principles have been devised [in this paper](https://doi.org/10.1016/j.procs.2016.08.014). This post will give a quick summary of these principles and look at some examples to outline aspects we should think about when creating mobile interfaces. 

## Effectiveness
Effectiveness describes how effective a user is while using an interface. The user has previous experience from other interfaces and the real world. In Human Computer Interaction (HCI) this is called a mental model the user is creating in order to comprehend complex concepts easier. We can increase the users effectiveness by benefitting from his knowledge gained from the real world. The goal of effectiveness is to reduce the _number of actions required to complete a task_. 

### Some examples
* [This PWA](https://guitar-tuner.appspot.com/) is a perfect example for using a mental model to increase the users effectiveness. By designing the digital tuner similar to how an analog tuner would look like, the user can immediately map this digital version of a tuner to his experience in the real world.
* Use matching and known icons to reduce the cognitive load. Combine them with small labels to reduce wrong interpretation.
* Another example for mental models would be a toggle to turn things on an off similar to a light switch in the real world

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/mui_effectiveness.jpg)


## Efficiency
Efficiency describes in what way the user can comprehend the _current state_ of the application and the operations that can be performed. It is measured in _actions per second_ and describes how efficient the user is in completing a task. 

### Some examples
* Give visual cues to where the user is located in the context of the interface. E.g. displaying view headlines, providing progress bars in forms, highlighting current tabs 
* If the interface is getting too complex, devise simple categories that subtasks can be assigned to. E.g. *Profile* for all user related data, *Collection* for saved items in the past, *Search* for dealing with new information. 

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/mui_efficiency.jpg)


## Productivity
Productivity describes how long a user takes to complete a task successfully. It also describes how easy it is for the user to _spot and identify functionalities_ offered by an interface. It is measured in the number of actions needed to complete a task relative to time. 

### Some examples
* Reduce the need for typing by providing shortcuts to important tasks in the interface
* Avoid misleading labelling, e.g. using the wrong icon
* Provide error messages, so the user can recover from errors quickly.

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/mui_productivity.jpg)

## Error Safety
Giving the user feedback is one of the most important parts of interface design. With appropriate feedback errors can be reduced significantly. We can measure Error Safety by counting _the number of errors committed in each action of each task_.

### Some examples
* Provide appropriate feedback to user actions
* Highlight important / new information
* Provide tutorials or tooltips, which can be viewed when needed
* Show the name of the current view / task / user
* Give feedback when the user has committed an error or the system isn’t working as expected, e.g. form errors, alerts when something couldn’t be uploaded / handled

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/mui_error.jpg)

## Cognitive Load
Reducing cognitive load in the user is essential to making an interface feel nice to use. We can do this by using metaphors for difficult concepts and keeping the interface simple in order not to confuse the user. A way of measuring cognitive load is by counting the _actions per view_. 

### An example
* Provide animation between view and context transitions, avoid rough cuts and confusing context changes
* Use familiar and matching symbols to make the navigation and task completion easier for the user 
* Use logic flow to let the user complete a new task quickly

![](https://raw.githubusercontent.com/lisilinhart/lisilinhart.github.io/master/images/mui_cognitive.jpg)

## Conclusion 
When we design an user interface the focus of it's design should always lie on if the interface is helping the user to fullfill the task he wants to complete. Some questions to ask yourself during the design of any interface are:

* Is my interface allowing the user to complete a task in the easiest way?
* Is the interface reducing cognitive load by following simplicity and taking advantage of mental models?
* Is the interface showing the user where he is located in it's context, avoiding confusing states and disorientation?
* Does the user get appropiate feedback to his actions?
* Has the interface considered possible errors and provides feedback to these errors? 

Since mobile interfaces are very limited due to small screen sizes, it's even more important to keep applications simple and focused on the tasks the user wants to complete. If the interface is getting too complex and confusing, it might be because it tries to fullfill to many diverse conditions and should actually be split in different applications. By keeping Effectiveness, Efficiency, Productivity, Error Safety and Cognitive Load in mind we can avoid building interfaces, that might look fancy but don't actually support the user in his task completion. 


### Resources
* [Mapping HCI Principles to Design Quality of Mobile User Interfaces in Healthcare Applications](https://doi.org/10.1016/j.procs.2016.08.014)
* [Resources for Progressive Web Apps](https://github.com/TalAter/awesome-progressive-web-apps)