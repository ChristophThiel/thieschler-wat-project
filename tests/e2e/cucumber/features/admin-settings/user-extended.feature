  Scenario: admin creates a user
    When "Admin" logs in
    And "Admin" opens the "admin-settings" app
    And "Admin" navigates to the users management page
    And "Admin" creates the following user
      | name   | displayname | email                        | password |
      | Michel | Michel T.   | michel.tischler@opencloud.eu | 12345678 |
    And "Admin" logs out
    When "Michel" logs in
    Then "Michel" should have self info:
      | key      | value                        |
      | username | Michel                       |
      | email    | michel.tischler@opencloud.eu |
    And "Michel" logs out
