Feature: Download extended
  As a user
  I want to download resources

  Background:
    Given "Admin" creates following user using API
      | id        |
      | Christoph |
      | Michel    |

  Scenario: download single resource
    And "Christoph" creates the following files into personal space using API
      | pathToFile                      | content     |
      | file.txt                        | lorem ipsum |

    When "Christoph" logs in
    And "Christoph" downloads the following resource using the context menu
      | resource       | type   |
      | file.txt       | file   |
    And "Christoph" logs out

  Scenario: download withdrawn resource
    And "Christoph" creates the following files into personal space using API
      | pathToFile                      | content     |
      | shared.txt                      | lorem ipsum |
    And "Christoph" shares the following resource using API
      | resource       | recipient | type | role     |
      | shared.txt     | Michel    | user | Can edit |

    When "Michel" logs in
    And "Michel" navigates to the shared with me page
    And "Michel" opens the following file in texteditor
      | resource       |
      | shared.txt     |
    And "Michel" closes the file viewer
    And "Michel" logs out

    When "Christoph" logs in
    And "Christoph" removes following sharee
      | resource           | recipient |
      | shared.txt         | Michel    |
    And "Christoph" logs out

    When "Michel" logs in
    And "Michel" navigates to the shared with me page
    And "Michel" should not be able to see the following shares
      | resource           | owner        |
      | shared.txt         | Unc          |
    And "Michel" logs out