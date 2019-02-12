
# Qvain Roadmap

> This is a living document outlining plans and priorities for the Qvain service.

## Introduction

Qvain is the metadata editor of the Fairdata project by the Finnish [Ministry of Education and Culture](https://minedu.fi/en/). It has been developed at the [National Library of Finland](https://www.kansalliskirjasto.fi/) together with the [IT Center for Science (CSC)](https://csc.fi/).

Qvain is a web application. The UI itself – about 2/3rds of total SLOC – is written in [Vue](https://vuejs.org/) (Javascript); the other third is back-end code written in the [Go (Golang)](https://golang.org/) programming language. It is accurate to think of Qvain as mainly a Vue web application with a thin API layer in Go.

### Original spec

The original spec was to create a service that takes one or more metadata schemas and produces a form for end-users (researchers) to ingest metadata into long-term preservation systems.

### Updated spec

Throughout the project, as other services were developed and the underlying schemas massively adapted and expanded, the original spec has been adapted to catch up with reality.

The literal "form" approach has turned out to be problematic as traditional form elements can't describe multi-lingual widgets and lists very well.

Increasing richness and deeply nested nature of the evolving schemas have made this "form" approach difficult to represent in a UI without overloading both the user interface with form elements and hitting restrictions related to for instance browser width.

A better vision to move towards would be that of a data interface where not every data element is editable or visible by default; that is, a separation between input screens and data overview, where users get a clear overview what is in the datasets they have already entered, and are guided to separate screens, modals or pop-overs for the entering of data.

### Technologies

#### Front-end

Since the complex nature of the required metadata and the requirement of validation, the need for a dynamic Javascript interface pointed itself out, potentially as an [SPA](https://en.wikipedia.org/wiki/Single-page_application).

At the time the project's planning phase started, the main frameworks for Javscript UI were Angular 1, Angular 2 and React, a few smaller ones such as Vue, Mithril and Riot. Because of a lack of pre-existing Javacript expertise in the most modern frameworks – and hence no strong opinions – the frameworks were evaluated in order of apparent popularity.

- Angular was going through a messy transition from version 1 to version 2, and was put lower on the preference list.
- A simple mock-up for dynamic forms was made in React but stopped working after two weeks due to the quickly changing nature of the framework. React was discarded because it was thought that its pace of development might not suit a long-term project, or at least a project that would spend a significant time in maintenance mode.
- Vue was gaining popularity rapidly; it was conceptually more minimal and its release cadence more stable than Angular and React. The project chose Vue. This seems to have been a good decision, as Vue might now be (end 2018) the most popular framework and still maintains its minimalism and backwards compatibility.

#### Back-end

For the back-end, Perl, Python and Go were considered. Go was chosen because the back-end would be a thin and fast service which happen to be Go's forte. Although there was more know-how among developers in Perl and Python, it was felt that these older languages have typically problems with high concurrency and even unicode, problems which have been solved by more modern languages. In hindsight (end of 2018), while Go (Golang) one of the most popular languages for services the last years, it has been more challenging to find know-how in traditionally perhaps more conservative academic and governmental organisations where the up-take has been slower than in other sectors.

The Go code does not use any high-level frameworks.

#### Database

The central database for the service is [Postgresql](https://www.postgresql.org/). The main reasons for this choice were developer familiarity and [JSON/JSONB](https://www.postgresql.org/docs/9.6/functions-json.html) functionality. Some of Qvain's downstream services also use Postgresql. which might enable solutions where the services could share a database cluster or sychronise database tables through Postgresql replication if the API approach would not deliver the performance required down the line.

Qvain does not use an ORM or other database layer.

#### Redis

Qvain optionally uses [Redis](https://redis.io/). Redis is a common Swiss army knife tool for in-memory storage of ephemeral data – such as session info.


## Concept

This section talks about Qvain application logic. Most of the application logic is in the Javascript front-end, as the back-end mostly provides the glue between other data and user services and of course handles data storage; we will not discuss the back-end here. The word Qvain shall refer to the Javascript code in the project.


### Terminology

component: a Vue component
widget: a Vue component that derives from the base component; i.e., a component that is aware of its path in the tree.
validator: validation code that checks json-schema compliance
schema: any of the sub-schema's in a json-schema document
combinatorial logic: `allOf`, `anyOf`, `oneOf` and `not` logical keywords; these represent a choice and often require user interaction

### Implementation

In Qvain, we have a metadata schema represented by a tree. We also have a data tree containing the user-provided metadata – this tree can be empty. Each (sub)schema in the metadata schema should have a value associated with it for the corresponding path in the data tree. Basically, we have a tree that describes the type and validation rules (in json-schema), and a tree with data that ought to follow these rules.

For each schema, Qvain analyses the json-schema to derive the most appropriate type for the UI; for instance, an `object` returns by default an object widget. It then creates an instance of this Vue component with the schema and data as parameters. In version 1, this dispatch logic is in a Vue component wrapper, and the trees are passed as `prop`. Qvain has standard json-schema components to be used to represent the basic json-schema data types `number`, `string`, `object`, `array`, `null` and combination keywords `allOf`, `anyOf`, `oneOf` and `not`.

Each widget can override its default json-schema representation with an entry in a UI file in JSON format, indexed by path. For example, if a data point is a coordinate object with longitude and latitude, Qvain will show a generic `object` component with fields `longitude` and `latitude`, which are in turn components for number input. However, by overriding the absolute path or the path to the json-pointer of that component's definition, one could trivially make a Vue component that shows a map and address box. This component would then insert the required data as object with longitude and latitude so that data will externally conform to its schema. This UI file can also override `title`, `description` and set additional `help`, `placeholder` and other information.

> The reason for the external UI file is that the original json-schemas for Fairdata don't contain quite enough information to show a full UI by themselves. In theory, the original schemas could be enhanced with all the necessary information, and Qvain could only use that more complete schema.

On data change, Vuex triggers a validator. Validation results are also indexed by json-schema path. Each widget listens to changes to its error object and can show live validation results through Vue reactivity. A basic json-schema validator is part of Qvain. If necessary, a more complete validator could be used; the main difficulty has been to keep the Vue reactivity intact with external validators so components can use live validation (cfr. bugs in AJV: https://github.com/epoberezkin/ajv/issues/876 https://github.com/epoberezkin/ajv/issues/512).

For storing datasets and schemas, Qvain uses [Vuex](https://vuex.vuejs.org/), which is the state library of Vue.

### Why dynamic

The core of Qvain builds an interface out of the json-schemas provided by – for the Fairdata project – [tietomallit.suomi.fi](https://tietomallit.suomi.fi/model/mrd/CatalogRecord/) (formerly [IOW](http://iow.csc.fi/model/mrd/CatalogRecord/)). Why not hard-code most of these schemas in some HTML page?

- There are several related schemas for Fairdata, with regular (so far) changes; it is thought it would be easier to handle all these variations by handling the schema directly;
- Most of the data points in these schemas are optional, meaning they don't exist or are empty lists when the dataset is empty, so most of the dynamic funtionality is required anyway;
- If the need arises, widgets can be design as hardcoded as needed without actually taking the schema into consideration.

## Milestones

### Version 1

In version 1, Vue passes its schema and data as nested trees into the wrapper/dispatch component. This component chooses the most relevant representation based on the schema, data and widget (from the UI file) information. The whole tree is then gradually built as components spawn children for their respective schema and data sub-trees.

Tabs are implemented as a "view" of a sub-tree. Qvain walks the whole schema tree, but it shows only those branches for which the tab name matches the currently active tab.

This approach mixes UI components and schema logic. It works well for small schemas, but slows down somewhat for very large schemas. Making changes requires a deep understanding of the "engine" because the logic of UI components comes side-by-side with the code that creates those components. The approach of classes that know how to represent themselves is certainly valid in traditional programming, but in Vue an approach where the UI is strictly separated from the core "business" logic would make the code more robust and especially easier to contribute to for developers.

#### Problems

Because the complexity and especially the level of nested depth has significantly increased in Fairdata schemas even after the freeze period, it would be very much desired not to literally follow the schema's nestedness in the UI. Sadly enough, the "tree" approach in version 1 makes detangling challenging because it is not trivial to show data points merely by path – this would require to cut sub-trees, making sure schema and data paths line up.

Also, due to expanded size of Fairdata's schemas compared to the much smaller schemas at the start of the project, the form approach from the original spec does not translate well into UI anymore. For instance, using "real" form labels, help and error messages does not translate well to data elements that are really lists of objects instead of mere HTML input elements.

### Version 2

##### Core

In November 2018, work has started on improving the core logic of version 1 by using pure Javacript – or more accurately, Vuex – functions instead of actual Vue UI components so the UI can be completely separated from business logic. Qvain would then have a clear split between Qvain "core" and Qvain "widgets", making it easier for developers to contribute without having to study the whole application.

Schema and data tree logic would be hidden from components by addressing subschemas and their respective data _by path_; and most component logic from the wrapper element would be re-implemented inside Vuex.

Any UI widget would only need to know its path to resolve its context. Querying by this path in Vuex then returns its type, widget, UI information and whatnot.

Combinatorial logic would then be handled by an `Unresolved` component, which suspends the resolving of a path until the user makes a choice. For instance, if the user wants to add a `Creator` that can either be a `Person` or `Company` – a `oneOf` relationship – the path resolver would first assign this `Unresolved` component for that path in its cache; upon resolution, it would then clear the data and assign the next component for the chosen sub-schema.

##### UI/UX

Since the current Fairdata schemas are too nested now to show everything on one page – up to 7 or 8 levels deep even with tabs in some places, there have been some experiments with having a separate view and edit screen. A lot of different solutions have been discussed. Some typical solutions include modal windows and slide-out panels, but these just delay the problem if the data within them is itself deeply nested. One solution under development is a sliding interface – like is common in mobile interfaces – where the user only sees e.g. names in a list view, and upon clicking is then taken to an edit interface for the individual people in that list.

Some work on wireframing has been done by our organisation's UX designer in December 2018. Considerations included UX consistency, accessibilty and confusing users with interfaces that change views (as opposed to all in one screen).

The version 2 UI improvement depends on the _path addressing_ mentioned above. Addressing tree branches would be too brittle and complex; path addressing would make this simply a matter of basic UI component (re)design.

### Version 3 (future ideas)

There are no concrete plans for version 3; or at least, there is no timetable or priority list for future features. Loose ideas include:

- storing user data so users would not need to re-enter the same persons, organisations or other information all over;
- group/admin functionality based on Perun;
- logging improvements across Fairdata services;
- improving the use of Qvain with different metadata schemas;
- import and export functionality;
- update to the upcoming Vue 3, which will bring some improvements to reactivity benefitting Qvain.
